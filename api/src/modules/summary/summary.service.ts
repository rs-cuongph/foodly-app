import { Inject, Injectable } from '@nestjs/common';
import {
  SummaryMode,
  OrderAmountSummaryResponse,
  OrderCountSummaryResponse,
  OrderStatusSummaryResponse,
} from './dto/summary.dto';
import { I18nService } from 'nestjs-i18n';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';

interface PeriodResult {
  date: Date;
  current_period?: number;
  previous_period?: number;
}

@Injectable()
export class SummaryService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private i18n: I18nService,
  ) {}

  async getOrderAmountSummary(
    mode: SummaryMode,
    organization_id?: string,
  ): Promise<OrderAmountSummaryResponse[]> {
    const now = new Date();
    let startDate: Date;
    let groupBy: string;

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = new Date(now.setDate(now.getDate() - 7));
        groupBy = 'DATE(created_at)';
        break;
      case SummaryMode.WEEKS:
        startDate = new Date(now.setDate(now.getDate() - 28));
        groupBy = "DATE_TRUNC('week', created_at)";
        break;
      case SummaryMode.MONTHS:
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        groupBy = "DATE_TRUNC('month', created_at)";
        break;
    }

    const results = await this.prismaService.client.$queryRaw`
      SELECT 
        ${groupBy} as date,
        COUNT(*) as order_count,
        SUM(amount) as total_amount
      FROM "Order"
      WHERE created_at >= ${startDate}
      AND deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
      GROUP BY ${groupBy}
      ORDER BY date ASC
    `;

    return results as OrderAmountSummaryResponse[];
  }

  async getOrderCountSummary(
    mode: SummaryMode,
    organization_id?: string,
  ): Promise<OrderCountSummaryResponse[]> {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let groupBy: string;

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = new Date(now.setDate(now.getDate() - 7));
        previousStartDate = new Date(now.setDate(now.getDate() - 14));
        groupBy = 'DATE(created_at)';
        break;
      case SummaryMode.WEEKS:
        startDate = new Date(now.setDate(now.getDate() - 28));
        previousStartDate = new Date(now.setDate(now.getDate() - 56));
        groupBy = "DATE_TRUNC('week', created_at)";
        break;
      case SummaryMode.MONTHS:
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        previousStartDate = new Date(now.setFullYear(now.getFullYear() - 2));
        groupBy = "DATE_TRUNC('month', created_at)";
        break;
    }

    const currentPeriod = (await this.prismaService.client.$queryRaw`
      SELECT 
        ${groupBy} as date,
        COUNT(*) as current_period
      FROM "Order"
      WHERE created_at >= ${startDate}
      AND deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
      GROUP BY ${groupBy}
      ORDER BY date ASC
    `) as PeriodResult[];

    const previousPeriod = (await this.prismaService.client.$queryRaw`
      SELECT 
        ${groupBy} as date,
        COUNT(*) as previous_period
      FROM "Order"
      WHERE created_at >= ${previousStartDate}
      AND created_at < ${startDate}
      AND deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
      GROUP BY ${groupBy}
      ORDER BY date ASC
    `) as PeriodResult[];

    // Merge the results
    const mergedResults = currentPeriod.map((current) => {
      const previous = previousPeriod.find(
        (p) => p.date.getTime() === current.date.getTime(),
      );
      return {
        date: current.date,
        current_period: current.current_period,
        previous_period: previous ? previous.previous_period : 0,
      };
    });

    return mergedResults as OrderCountSummaryResponse[];
  }

  async getOrderStatusSummary(
    mode: SummaryMode,
    organization_id?: string,
  ): Promise<OrderStatusSummaryResponse[]> {
    const now = new Date();
    let startDate: Date;

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case SummaryMode.WEEKS:
        startDate = new Date(now.setDate(now.getDate() - 28));
        break;
      case SummaryMode.MONTHS:
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
    }

    const results = await this.prismaService.client.$queryRaw`
      WITH total_orders AS (
        SELECT COUNT(*) as total
        FROM "Order"
        WHERE created_at >= ${startDate}
        AND deleted_at IS NULL
        ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
      )
      SELECT 
        status,
        COUNT(*) as count,
        ROUND((COUNT(*)::float / total::float) * 100, 2) as percentage
      FROM "Order", total_orders
      WHERE created_at >= ${startDate}
      AND deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
      GROUP BY status, total
      ORDER BY count DESC
    `;

    return results as OrderStatusSummaryResponse[];
  }
}
