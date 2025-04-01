import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { FoodTrendAnalysisDTO } from './dto/food-trend.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('food-trends')
  @ApiOperation({ summary: 'Analyze food ordering trends' })
  @ApiResponse({
    status: 200,
    description: 'Returns analysis of food ordering trends',
  })
  async analyzeFoodTrends(
    @Query() query: FoodTrendAnalysisDTO,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.analyzeFoodTrends(query, user);
  }
}
