import { ApiProperty } from '@nestjs/swagger';
import { EnumField } from '@decorators/validation/enum.decorator';
import { StringFieldOptional } from '@decorators/validation/string.decorator';

export enum SummaryMode {
  DAYS = 'DAYS',
  WEEKS = 'WEEKS',
  MONTHS = 'MONTHS',
}

export class GetOrderAmountSummaryDto {
  @ApiProperty({ enum: SummaryMode, description: 'Summary mode' })
  @EnumField(() => SummaryMode)
  mode: SummaryMode;

  @ApiProperty({ required: false, description: 'Organization ID' })
  @StringFieldOptional()
  organization_id?: string;
}

export class GetOrderCountSummaryDto {
  @ApiProperty({ enum: SummaryMode, description: 'Summary mode' })
  @EnumField(() => SummaryMode)
  mode: SummaryMode;

  @ApiProperty({ required: false, description: 'Organization ID' })
  @StringFieldOptional()
  organization_id?: string;
}

export class GetOrderStatusSummaryDto {
  @ApiProperty({ enum: SummaryMode, description: 'Summary mode' })
  @EnumField(() => SummaryMode)
  mode: SummaryMode;

  @ApiProperty({ required: false, description: 'Organization ID' })
  @StringFieldOptional()
  organization_id?: string;
}

export class OrderAmountSummaryResponse {
  @ApiProperty()
  date: string;

  @ApiProperty()
  total_amount: number;

  @ApiProperty()
  order_count: number;
}

export class OrderCountSummaryResponse {
  @ApiProperty()
  date: Date;

  @ApiProperty()
  current_period: number;

  @ApiProperty()
  previous_period: number;
}

export class OrderStatusSummaryResponse {
  @ApiProperty()
  status: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  percentage: number;
}
