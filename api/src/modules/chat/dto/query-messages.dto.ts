import { IsOptional, IsNumber, IsDateString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

export class QueryMessagesDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @IsOptional()
  @IsDateString()
  before?: string;

  @IsOptional()
  @IsDateString()
  after?: string;
}
