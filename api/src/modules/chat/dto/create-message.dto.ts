import {
  IsString,
  IsEnum,
  IsOptional,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { MessageType } from '@prisma/client';

export class CreateMessageDto {
  @IsUUID()
  @IsNotEmpty()
  room_id: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType = MessageType.TEXT;

  @IsOptional()
  metadata?: any;
}
