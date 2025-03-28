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

interface AmountResult {
  date: Date;
  order_count: number;
  total_amount: number;
}

interface StatusResult {
  status: string;
  count: number;
  percentage: number;
}

@Injectable()
export class SummaryService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private i18n: I18nService,
  ) {}

  /**
   * Lấy thống kê tổng tiền và số lượng order theo thời gian
   * @param mode - Chế độ thống kê: 7 ngày, 4 tuần, 12 tháng
   * @param organization_id - ID của tổ chức (tùy chọn)
   * @returns Mảng các kết quả thống kê theo ngày/tuần/tháng
   *
   * Logic:
   * 1. Xác định khoảng thời gian và cách nhóm dữ liệu dựa vào mode
   * 2. Query dữ liệu từ bảng Order với các điều kiện:
   *    - Thời gian >= startDate
   *    - Chưa bị xóa (deleted_at IS NULL)
   *    - Thuộc organization (nếu có)
   * 3. Nhóm dữ liệu theo ngày/tuần/tháng
   * 4. Tính tổng số lượng order và tổng tiền
   * 5. Sắp xếp kết quả theo thời gian tăng dần
   */
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

    const results = (await this.prismaService.client.$queryRaw`
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
    `) as AmountResult[];

    return results;
  }

  /**
   * Lấy thống kê số lượng order theo thời gian, so sánh với khoảng thời gian trước
   * @param mode - Chế độ thống kê: 7 ngày, 4 tuần, 12 tháng
   * @param organization_id - ID của tổ chức (tùy chọn)
   * @returns Mảng các kết quả thống kê theo ngày/tuần/tháng, bao gồm cả khoảng thời gian trước
   *
   * Logic:
   * 1. Xác định khoảng thời gian hiện tại và khoảng thời gian trước
   * 2. Query dữ liệu cho khoảng thời gian hiện tại:
   *    - Thời gian >= startDate
   *    - Chưa bị xóa
   *    - Thuộc organization (nếu có)
   * 3. Query dữ liệu cho khoảng thời gian trước:
   *    - Thời gian >= previousStartDate và < startDate
   *    - Chưa bị xóa
   *    - Thuộc organization (nếu có)
   * 4. Gộp kết quả của hai khoảng thời gian
   * 5. Sắp xếp kết quả theo thời gian tăng dần
   */
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

  /**
   * Lấy thống kê tỉ lệ các trạng thái order theo thời gian
   * @param mode - Chế độ thống kê: 7 ngày, 4 tuần, 12 tháng
   * @param organization_id - ID của tổ chức (tùy chọn)
   * @returns Mảng các kết quả thống kê theo trạng thái, bao gồm số lượng và tỉ lệ phần trăm
   *
   * Logic:
   * 1. Xác định khoảng thời gian dựa vào mode
   * 2. Sử dụng CTE (Common Table Expression) để tính tổng số order
   * 3. Query dữ liệu từ bảng Order với các điều kiện:
   *    - Thời gian >= startDate
   *    - Chưa bị xóa
   *    - Thuộc organization (nếu có)
   * 4. Nhóm dữ liệu theo trạng thái
   * 5. Tính số lượng và tỉ lệ phần trăm cho mỗi trạng thái
   * 6. Sắp xếp kết quả theo số lượng giảm dần
   */
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

    const results = (await this.prismaService.client.$queryRaw`
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
    `) as StatusResult[];

    return results;
  }
}
