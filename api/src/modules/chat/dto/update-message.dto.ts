import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content?: string;

  @IsOptional()
  metadata?: any;
}
