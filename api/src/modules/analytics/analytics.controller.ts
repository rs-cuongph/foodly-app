import { Controller, Get, Query, Req } from '@nestjs/common';
import { AnalyticsService, SuggestedItemsResponse } from './analytics.service';
import { FoodTrendAnalysisDTO } from './dto/food-trend.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RequestWithUser } from 'src/types/requests.type';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('food-trends')
  @ApiOperation({ summary: 'Analyze food ordering trends' })
  @ApiResponse({
    status: 200,
    description: 'Returns analysis of food ordering trends',
  })
  analyzeFoodTrends(
    @Query() query: FoodTrendAnalysisDTO,
    @Req() req: RequestWithUser,
  ): Promise<SuggestedItemsResponse> {
    return this.analyticsService.analyzeFoodTrends(query, req.user);
  }
}
