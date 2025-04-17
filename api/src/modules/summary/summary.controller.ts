import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SummaryService } from './summary.service';
import {
  GetOrderAmountSummaryDto,
  GetOrderCountSummaryDto,
  GetOrderStatusSummaryDto,
} from './dto/summary.dto';
import { RequestWithUser } from 'src/types/requests.type';

@ApiTags('Summary')
@Controller('summary')
@ApiBearerAuth()
export class SummaryController {
  constructor(private readonly summaryService: SummaryService) {}

  @Get('order-amount')
  @ApiOperation({ summary: 'Get order amount summary' })
  async getOrderAmountSummary(
    @Query() query: GetOrderAmountSummaryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.summaryService.getOrderAmountSummary(
      query.mode,
      req.user.organization_id,
      req.user.id,
    );
  }

  @Get('order-count')
  @ApiOperation({ summary: 'Get order count summary' })
  async getOrderCountSummary(
    @Query() query: GetOrderCountSummaryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.summaryService.getOrderCountSummary(
      query.mode,
      req.user.organization_id,
      req.user.id,
    );
  }

  @Get('order-status')
  @ApiOperation({ summary: 'Get order status summary' })
  async getOrderStatusSummary(
    @Query() query: GetOrderStatusSummaryDto,
    @Req() req: RequestWithUser,
  ) {
    return this.summaryService.getOrderStatusSummary(
      query.mode,
      req.user.organization_id,
      req.user.id,
    );
  }
}
