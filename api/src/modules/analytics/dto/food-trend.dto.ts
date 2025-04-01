import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FoodTrendAnalysisDTO {
  @ApiProperty({
    description: 'Start date for analysis',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({
    description: 'End date for analysis',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_date?: string;

  @ApiProperty({
    description: 'Group ID to analyze',
    required: false,
  })
  @IsOptional()
  @IsString()
  group_id?: string;
}

export class FoodTrendResponseDTO {
  @ApiProperty({
    description: 'Analysis summary',
  })
  summary: string;

  @ApiProperty({
    description: 'Popular food items with their order counts',
  })
  popular_items: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;

  @ApiProperty({
    description: 'Trending patterns and insights',
  })
  insights: string[];
}
