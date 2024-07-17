import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
export class CreateOrderDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  content: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(100)
  quanlity: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  price: number;
}
