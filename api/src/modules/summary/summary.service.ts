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
import * as dayjs from 'dayjs';
import * as weekOfYear from 'dayjs/plugin/weekOfYear';
import * as isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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
    organization_id: string,
    user_id: string,
  ): Promise<OrderAmountSummaryResponse[]> {
    const now = dayjs();
    let startDate: Date;
    let timeIntervals: Date[] = [];

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = now.subtract(7, 'day').toDate();
        // Tạo mảng 7 ngày
        timeIntervals = Array.from({ length: 7 }, (_, i) =>
          now.subtract(6 - i, 'day').toDate(),
        );
        break;
      case SummaryMode.WEEKS:
        startDate = now.subtract(28, 'day').toDate();
        // Tạo mảng 4 tuần
        timeIntervals = Array.from({ length: 4 }, (_, i) =>
          now
            .subtract(3 - i, 'week')
            .startOf('week')
            .toDate(),
        );
        break;
      case SummaryMode.MONTHS:
        startDate = now.subtract(1, 'year').toDate();
        // Tạo mảng 12 tháng
        timeIntervals = Array.from({ length: 12 }, (_, i) =>
          now
            .subtract(11 - i, 'month')
            .startOf('month')
            .toDate(),
        );
        break;
    }

    const results = (await this.prismaService.client.$queryRaw`
      WITH grouped_dates AS (
        SELECT
          CASE 
            WHEN ${mode} = 'DAYS' THEN DATE(created_at)
            WHEN ${mode} = 'WEEKS' THEN DATE_TRUNC('week', created_at)
            WHEN ${mode} = 'MONTHS' THEN DATE_TRUNC('month', created_at)
          END as grouped_date
        FROM "Order"
        WHERE created_at >= ${startDate}
        AND deleted_at IS NULL
        ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
        ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = "Order".group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
      )
      SELECT
        grouped_date as date,
        COUNT(*) as order_count,
        COALESCE(SUM(amount), 0) as total_amount
      FROM "Order" o
      JOIN grouped_dates g ON 
        CASE 
          WHEN ${mode} = 'DAYS' THEN DATE(o.created_at)
          WHEN ${mode} = 'WEEKS' THEN DATE_TRUNC('week', o.created_at)
          WHEN ${mode} = 'MONTHS' THEN DATE_TRUNC('month', o.created_at)
        END = g.grouped_date
      WHERE o.created_at >= ${startDate}
      AND o.deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND o.organization_id = ${organization_id}` : Prisma.empty}
      ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = o.group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
      GROUP BY grouped_date
      ORDER BY date ASC
    `) as AmountResult[];

    return timeIntervals.map((date) => {
      const result = results.find((r) => {
        const resultDate = dayjs(r.date);
        const targetDate = dayjs(date);

        switch (mode) {
          case SummaryMode.DAYS:
            return resultDate.isSame(targetDate, 'day');
          case SummaryMode.WEEKS:
            return resultDate.isSame(targetDate, 'week');
          case SummaryMode.MONTHS:
            return resultDate.isSame(targetDate, 'month');
          default:
            return false;
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
    organization_id: string,
    user_id: string,
  ): Promise<OrderCountSummaryResponse[]> {
    const now = dayjs();
    let startDate: Date;
    let previousStartDate: Date;
    let timeIntervals: Date[] = [];

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = now.subtract(7, 'day').toDate();
        previousStartDate = now.subtract(14, 'day').toDate();
        // Tạo mảng 7 ngày
        timeIntervals = Array.from({ length: 7 }, (_, i) =>
          now.subtract(6 - i, 'day').toDate(),
        );
        break;
      case SummaryMode.WEEKS:
        startDate = now.subtract(28, 'day').toDate();
        previousStartDate = now.subtract(56, 'day').toDate();
        // Tạo mảng 4 tuần
        timeIntervals = Array.from({ length: 4 }, (_, i) =>
          now
            .subtract(3 - i, 'week')
            .startOf('week')
            .toDate(),
        );
        break;
      case SummaryMode.MONTHS:
        startDate = now.subtract(1, 'year').toDate();
        previousStartDate = now.subtract(2, 'year').toDate();
        // Tạo mảng 12 tháng
        timeIntervals = Array.from({ length: 12 }, (_, i) =>
          now
            .subtract(11 - i, 'month')
            .startOf('month')
            .toDate(),
        );
        break;
    }

    const currentPeriod = (await this.prismaService.client.$queryRaw`
      WITH grouped_dates AS (
        SELECT
          CASE 
            WHEN ${mode} = 'DAYS' THEN DATE(created_at)
            WHEN ${mode} = 'WEEKS' THEN DATE_TRUNC('week', created_at)
            WHEN ${mode} = 'MONTHS' THEN DATE_TRUNC('month', created_at)
          END as grouped_date
        FROM "Order"
        WHERE created_at >= ${startDate}
        AND deleted_at IS NULL
        ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
        ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = "Order".group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
      )
      SELECT
        grouped_date as date,
        COUNT(*) as current_period
      FROM "Order" o
      JOIN grouped_dates g ON 
        CASE 
          WHEN ${mode} = 'DAYS' THEN DATE(o.created_at)
          WHEN ${mode} = 'WEEKS' THEN DATE_TRUNC('week', o.created_at)
          WHEN ${mode} = 'MONTHS' THEN DATE_TRUNC('month', o.created_at)
        END = g.grouped_date
      WHERE o.created_at >= ${startDate}
      AND o.deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND o.organization_id = ${organization_id}` : Prisma.empty}
      ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = o.group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
      GROUP BY grouped_date
      ORDER BY date ASC
    `) as PeriodResult[];

    const previousPeriod = (await this.prismaService.client.$queryRaw`
      WITH grouped_dates AS (
        SELECT
          CASE 
            WHEN ${mode} = 'DAYS' THEN DATE(created_at)
            WHEN ${mode} = 'WEEKS' THEN DATE_TRUNC('week', created_at)
            WHEN ${mode} = 'MONTHS' THEN DATE_TRUNC('month', created_at)
          END as grouped_date
        FROM "Order"
        WHERE created_at >= ${previousStartDate}
        AND created_at < ${startDate}
        AND deleted_at IS NULL
        ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
        ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = "Order".group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
      )
      SELECT
        grouped_date as date,
        COUNT(*) as previous_period
      FROM "Order" o
      JOIN grouped_dates g ON 
        CASE 
          WHEN ${mode} = 'DAYS' THEN DATE(o.created_at)
          WHEN ${mode} = 'WEEKS' THEN DATE_TRUNC('week', o.created_at)
          WHEN ${mode} = 'MONTHS' THEN DATE_TRUNC('month', o.created_at)
        END = g.grouped_date
      WHERE o.created_at >= ${previousStartDate}
      AND o.created_at < ${startDate}
      AND o.deleted_at IS NULL
      ${organization_id ? Prisma.sql`AND o.organization_id = ${organization_id}` : Prisma.empty}
      ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = o.group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
      GROUP BY grouped_date
      ORDER BY date ASC
    `) as PeriodResult[];

    return timeIntervals.map((date) => {
      const current = currentPeriod.find((r) => {
        const resultDate = dayjs(r.date);
        const targetDate = dayjs(date);

        switch (mode) {
          case SummaryMode.DAYS:
            return resultDate.isSame(targetDate, 'day');
          case SummaryMode.WEEKS:
            return resultDate.isSame(targetDate, 'week');
          case SummaryMode.MONTHS:
            return resultDate.isSame(targetDate, 'month');
          default:
            return false;
        }
      });

      const previous = previousPeriod.find((r) => {
        const resultDate = dayjs(r.date);
        const targetDate = dayjs(date);

        switch (mode) {
          case SummaryMode.DAYS:
            return resultDate.isSame(targetDate, 'day');
          case SummaryMode.WEEKS:
            return resultDate.isSame(targetDate, 'week');
          case SummaryMode.MONTHS:
            return resultDate.isSame(targetDate, 'month');
          default:
            return false;
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
    organization_id: string,
    user_id: string,
  ): Promise<OrderStatusSummaryResponse[]> {
    const now = dayjs();
    let startDate: Date;

    switch (mode) {
      case SummaryMode.DAYS:
        startDate = now.subtract(7, 'day').toDate();
        break;
      case SummaryMode.WEEKS:
        startDate = now.subtract(28, 'day').toDate();
        break;
      case SummaryMode.MONTHS:
        startDate = now.subtract(1, 'year').toDate();
        break;
    }

    console.log(startDate);
    const results = (await this.prismaService.client.$queryRaw`
      WITH total_orders AS (
        SELECT COUNT(*) as total
        FROM "Order"
        WHERE created_at >= ${startDate}
        AND deleted_at IS NULL
        ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
        ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = "Order".group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
      ),
      status_counts AS (
        SELECT
          status,
          COUNT(*) as count
        FROM "Order"
        WHERE created_at >= ${startDate}
        AND deleted_at IS NULL
        ${organization_id ? Prisma.sql`AND organization_id = ${organization_id}` : Prisma.empty}
        ${user_id ? Prisma.sql`AND EXISTS (SELECT 1 FROM "Group" g WHERE g.id = "Order".group_id AND g.created_by_id = ${user_id})` : Prisma.empty}
        GROUP BY status
      )
      SELECT
        s.status,
        COALESCE(s.count, 0) as count,
        CASE 
          WHEN t.total > 0 THEN ROUND((COALESCE(s.count, 0)::numeric / t.total::numeric) * 100, 2)
          ELSE 0
        END as percentage
      FROM total_orders t
      CROSS JOIN (
        SELECT DISTINCT status FROM "Order" WHERE status IS NOT NULL
        UNION
        SELECT NULL WHERE EXISTS (
          SELECT 1 FROM "Order" WHERE status IS NULL
        )
      ) all_statuses
      LEFT JOIN status_counts s ON s.status = all_statuses.status
      ORDER BY s.count DESC NULLS LAST
    `) as StatusResult[];

    return results.map((result) => ({
      status: result.status,
      count: Number(result.count),
      percentage: result.percentage,
    }));
  }
}
