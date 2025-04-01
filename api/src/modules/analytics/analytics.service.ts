import { Injectable, Inject } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import {
  FoodTrendAnalysisDTO,
  FoodTrendResponseDTO,
} from './dto/food-trend.dto';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { z } from 'zod';

@Injectable()
export class AnalyticsService {
  private chatModel: ChatOpenAI;
  private parser: StructuredOutputParser<z.infer<typeof this.schema>>;
  private schema = z.object({
    summary: z.string(),
    popular_items: z.array(
      z.object({
        name: z.string(),
        count: z.number(),
        percentage: z.number(),
      }),
    ),
    insights: z.array(z.string()),
  });

  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {
    this.chatModel = new ChatOpenAI({
      modelName: 'gpt-4',
      temperature: 0.7,
    });

    this.parser = StructuredOutputParser.fromZodSchema(this.schema);
  }

  async analyzeFoodTrends(
    query: FoodTrendAnalysisDTO,
    user: any,
  ): Promise<FoodTrendResponseDTO> {
    const { start_date, end_date, group_id } = query;

    // Build where clause for orders
    const whereClause: any = {
      status: 'COMPLETED',
      organization_id: user.organization_id,
    };

    if (start_date) {
      whereClause.created_at = {
        ...whereClause.created_at,
        gte: new Date(start_date),
      };
    }

    if (end_date) {
      whereClause.created_at = {
        ...whereClause.created_at,
        lte: new Date(end_date),
      };
    }

    if (group_id) {
      whereClause.group_id = group_id;
    }

    // Fetch completed orders with their menu items
    const orders = await this.prismaService.client.order.findMany({
      where: whereClause,
      select: {
        menu: true,
        created_at: true,
      },
    });

    // Process the data for analysis
    const menuItemCounts = this.processOrderData(orders);

    // Create prompt for LangChain
    const prompt = PromptTemplate.fromTemplate(`
      Analyze the following food ordering data and provide insights about ordering trends:

      Order Data:
      {orderData}

      Please provide:
      1. A summary of the ordering patterns
      2. Analysis of popular items and their percentages
      3. Key insights about customer preferences and trends

      {format_instructions}
    `);

    // Format the data for the prompt
    const formattedData = this.formatDataForPrompt(menuItemCounts);

    // Get analysis from LangChain
    const response = await this.chatModel.call(
      await prompt.format({
        orderData: formattedData,
        format_instructions: this.parser.getFormatInstructions(),
      }),
    );

    // Parse the response
    const analysis = await this.parser.parse(response.content);

    return {
      summary: analysis.summary,
      popular_items: analysis.popular_items,
      insights: analysis.insights,
    };
  }

  private processOrderData(orders: any[]): Map<string, number> {
    const menuItemCounts = new Map<string, number>();
    let totalOrders = 0;

    orders.forEach((order) => {
      order.menu.forEach((item: any) => {
        const count = menuItemCounts.get(item.name) || 0;
        menuItemCounts.set(item.name, count + 1);
        totalOrders++;
      });
    });

    return menuItemCounts;
  }

  private formatDataForPrompt(menuItemCounts: Map<string, number>): string {
    const totalOrders = Array.from(menuItemCounts.values()).reduce(
      (a, b) => a + b,
      0,
    );

    return Array.from(menuItemCounts.entries())
      .map(([name, count]) => {
        const percentage = (count / totalOrders) * 100;
        return `${name}: ${count} orders (${percentage.toFixed(2)}%)`;
      })
      .join('\n');
  }
}
