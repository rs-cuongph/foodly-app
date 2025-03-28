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
  order_count: bigint;
  total_amount: Prisma.Decimal;
}

interface StatusResult {
  status: string;
  count: bigint;
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
   * 2. Tạo mảng các ngày/tuần/tháng cần hiển thị
   * 3. Query dữ liệu từ bảng Order với các điều kiện:
   *    - Thời gian >= startDate
   *    - Chưa bị xóa (deleted_at IS NULL)
   *    - Thuộc organization (nếu có)
   * 4. Nhóm dữ liệu theo ngày/tuần/tháng
   * 5. Tính tổng số lượng order và tổng tiền
   * 6. Gộp kết quả với mảng thời gian để đảm bảo đủ dữ liệu
   */
  async getOrderAmountSummary(
    mode: SummaryMode,
    organization_id?: string,
  ): Promise<OrderAmountSummaryResponse[]> {
    const now = new Date();
    let startDate: Date;
    let groupBy: string;
    let timeIntervals: Date[] = [];

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = new Date(now.setDate(now.getDate() - 7));
        groupBy = 'DATE(created_at)';
        // Tạo mảng 7 ngày
        for (let i = 0; i < 7; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          timeIntervals.push(date);
        }
        break;
      case SummaryMode.WEEKS:
        startDate = new Date(now.setDate(now.getDate() - 28));
        groupBy = "DATE_TRUNC('week', created_at)";
        // Tạo mảng 4 tuần
        for (let i = 0; i < 4; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i * 7);
          timeIntervals.push(date);
        }
        break;
      case SummaryMode.MONTHS:
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        groupBy = "DATE_TRUNC('month', created_at)";
        // Tạo mảng 12 tháng
        for (let i = 0; i < 12; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          timeIntervals.push(date);
        }
        break;
    }

    // Đảo ngược mảng để sắp xếp theo thứ tự tăng dần
    timeIntervals = timeIntervals.reverse();

    const results = (await this.prismaService.client.$queryRaw`
      SELECT 
        ${groupBy} as date,
        COUNT(*) as order_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM "Order"
      WHERE created_at >= ${startDate}
      AND deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
      GROUP BY ${groupBy}
      ORDER BY date ASC
    `) as AmountResult[];

    // Gộp kết quả với mảng thời gian
    return timeIntervals.map((date) => {
      const result = results.find((r) => {
        if (mode === SummaryMode.DAYS) {
          return r.date.toDateString() === date.toDateString();
        } else if (mode === SummaryMode.WEEKS) {
          return r.date.getTime() === date.getTime();
        } else {
          return (
            r.date.getMonth() === date.getMonth() &&
            r.date.getFullYear() === date.getFullYear()
          );
        }
      });

      return {
        date,
        order_count: result ? Number(result.order_count) : 0,
        total_amount: result ? result.total_amount.toString() : '0',
      };
    });
  }

  /**
   * Lấy thống kê số lượng order theo thời gian, so sánh với khoảng thời gian trước
   * @param mode - Chế độ thống kê: 7 ngày, 4 tuần, 12 tháng
   * @param organization_id - ID của tổ chức (tùy chọn)
   * @returns Mảng các kết quả thống kê theo ngày/tuần/tháng, bao gồm cả khoảng thời gian trước
   *
   * Logic:
   * 1. Xác định khoảng thời gian hiện tại và khoảng thời gian trước
   * 2. Tạo mảng các ngày/tuần/tháng cần hiển thị
   * 3. Query dữ liệu cho khoảng thời gian hiện tại và khoảng thời gian trước
   * 4. Gộp kết quả với mảng thời gian để đảm bảo đủ dữ liệu
   */
  async getOrderCountSummary(
    mode: SummaryMode,
    organization_id?: string,
  ): Promise<OrderCountSummaryResponse[]> {
    const now = new Date();
    let startDate: Date;
    let previousStartDate: Date;
    let groupBy: string;
    let timeIntervals: Date[] = [];

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = new Date(now.setDate(now.getDate() - 7));
        previousStartDate = new Date(now.setDate(now.getDate() - 14));
        groupBy = 'DATE(created_at)';
        // Tạo mảng 7 ngày
        for (let i = 0; i < 7; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          timeIntervals.push(date);
        }
        break;
      case SummaryMode.WEEKS:
        startDate = new Date(now.setDate(now.getDate() - 28));
        previousStartDate = new Date(now.setDate(now.getDate() - 56));
        groupBy = "DATE_TRUNC('week', created_at)";
        // Tạo mảng 4 tuần
        for (let i = 0; i < 4; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() - i * 7);
          timeIntervals.push(date);
        }
        break;
      case SummaryMode.MONTHS:
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        previousStartDate = new Date(now.setFullYear(now.getFullYear() - 2));
        groupBy = "DATE_TRUNC('month', created_at)";
        // Tạo mảng 12 tháng
        for (let i = 0; i < 12; i++) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          timeIntervals.push(date);
        }
        break;
    }

    // Đảo ngược mảng để sắp xếp theo thứ tự tăng dần
    timeIntervals = timeIntervals.reverse();

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

    // Gộp kết quả với mảng thời gian
    return timeIntervals.map((date) => {
      const current = currentPeriod.find((r) => {
        if (mode === SummaryMode.DAYS) {
          return r.date.toDateString() === date.toDateString();
        } else if (mode === SummaryMode.WEEKS) {
          return r.date.getTime() === date.getTime();
        } else {
          return (
            r.date.getMonth() === date.getMonth() &&
            r.date.getFullYear() === date.getFullYear()
          );
        }
      });

      const previous = previousPeriod.find((r) => {
        if (mode === SummaryMode.DAYS) {
          return r.date.toDateString() === date.toDateString();
        } else if (mode === SummaryMode.WEEKS) {
          return r.date.getTime() === date.getTime();
        } else {
          return (
            r.date.getMonth() === date.getMonth() &&
            r.date.getFullYear() === date.getFullYear()
          );
        }
      });

      return {
        date,
        current_period: current ? Number(current.current_period) : 0,
        previous_period: previous ? Number(previous.previous_period) : 0,
      };
    });
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

    // Convert BigInt to number
    return results.map((result) => ({
      status: result.status,
      count: Number(result.count),
      percentage: result.percentage,
    }));
  }
}
