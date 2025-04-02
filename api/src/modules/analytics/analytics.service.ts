import { Injectable, Inject } from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { FoodTrendAnalysisDTO } from './dto/food-trend.dto';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage } from '@langchain/core/messages';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderStatus } from '@prisma/client';
import { RequestWithUser } from 'src/types/requests.type';
import { ConfigService } from '@nestjs/config';

interface MenuItem {
  id: string;
  name: string;
  price: Decimal;
}

interface SuggestedItem {
  id: string;
  name: string;
  price: Decimal;
}

export interface SuggestedItemsResponse {
  suggestedItems: SuggestedItem[];
  explanation: string;
}

@Injectable()
export class AnalyticsService {
  private chatModel: ChatOpenAI;

  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private configService: ConfigService,
  ) {
    this.chatModel = new ChatOpenAI({
      modelName: 'gpt-3.5-turbo',
      apiKey: this.configService.get('openai.apiKey'),
      maxTokens: 500,
    });
  }

  async analyzeFoodTrends(
    query: FoodTrendAnalysisDTO,
    user: RequestWithUser['user'],
  ): Promise<SuggestedItemsResponse> {
    const { group_id } = query;

    // 1. Get menu items from the specified group
    const groupMenuItems = await this.prismaService.client.menuItem.findMany({
      where: {
        group_id: group_id,
        deleted_at: null,
      },
      select: {
        id: true,
        name: true,
        price: true,
      },
    });

    // 2. Get user's order history
    const userOrders = await this.prismaService.client.order.findMany({
      where: {
        created_by_id: user.id,
        status: {
          in: [OrderStatus.COMPLETED, OrderStatus.PROCESSING],
        },
        deleted_at: null,
      },
      select: {
        menu: true,
      },
    });

    // 3. Process order history for analysis
    const orderHistory = this.processOrderHistory(userOrders);

    // 4. Create prompt for AI analysis
    const prompt = this.createAnalysisPrompt(groupMenuItems, orderHistory);

    // 5. Get AI analysis
    const response = await this.chatModel.invoke([new HumanMessage(prompt)]);

    // 6. Parse AI response and map to full menu items
    const analysis = this.parseAIResponse(response.content as string);
    const suggestedItems = groupMenuItems.filter((item) =>
      analysis.suggestedItemIds.includes(item.id),
    );

    return {
      suggestedItems,
      explanation: analysis.explanation,
    };
  }

  private processOrderHistory(orders: any[]): MenuItem[] {
    const menuItems = new Map<string, MenuItem>();

    orders.forEach((order) => {
      const menu = order.menu as any[];
      menu.forEach((item: any) => {
        if (!menuItems.has(item.id)) {
          menuItems.set(item.id, {
            id: item.id,
            name: item.name,
            price: new Decimal(item.price),
          });
        }
      });
    });

    return Array.from(menuItems.values());
  }

  private createAnalysisPrompt(
    groupMenuItems: MenuItem[],
    orderHistory: MenuItem[],
  ): string {
    return `
      Dựa trên dữ liệu sau, hãy phân tích và đề xuất 1-2 món ăn phù hợp:

      Menu hiện tại của nhóm:
      ${JSON.stringify(groupMenuItems, null, 2)}

      Lịch sử đặt món của người dùng:
      ${JSON.stringify(orderHistory, null, 2)}

      Hãy phân tích và trả về kết quả theo format JSON sau:
      {
        "suggestedItemIds": ["id1", "id2"], // ID của 1-2 món được đề xuất từ menu hiện tại
        "explanation": "Lý do đề xuất bằng tiếng Việt"
      }

      Lưu ý:
      - Chỉ đề xuất các món có trong menu hiện tại của nhóm
      - Giải thích phải bằng tiếng Việt, ngắn gọn, dễ hiểu, không quá 100 từ, thay đổi theo từng người dùng
      - Có thể đề xuất 1 hoặc 2 món tùy theo độ phù hợp
      - Đảm bảo response là một JSON hợp lệ
    `;
  }

  private parseAIResponse(response: string): {
    suggestedItemIds: string[];
    explanation: string;
  } {
    try {
      // Clean up the response string
      const cleanResponse = response.trim();

      // Try to find JSON content between triple backticks if present
      const jsonMatch = cleanResponse.match(/```json\n([\s\S]*?)\n```/);
      const jsonContent = jsonMatch ? jsonMatch[1] : cleanResponse;

      // Parse the JSON content
      const parsed = JSON.parse(jsonContent);

      // Validate the required fields
      if (
        !Array.isArray(parsed.suggestedItemIds) ||
        typeof parsed.explanation !== 'string'
      ) {
        throw new Error('Invalid response format: missing required fields');
      }

      return {
        suggestedItemIds: parsed.suggestedItemIds,
        explanation: parsed.explanation,
      };
    } catch (error) {
      console.error('AI Response:', response);
      console.error('Parse Error:', error);
      throw new Error(`Failed to parse AI response: ${error.message}`);
    }
  }
}
