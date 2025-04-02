import { ApiProperty } from '@nestjs/swagger';
import { StringField } from '@decorators/validation/string.decorator';

export class FoodTrendAnalysisDTO {
  @StringField({
    allowEmpty: false,
  })
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
