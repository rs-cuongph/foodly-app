import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ChatRoomType } from '@prisma/client';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ChatRoomType)
  @IsOptional()
  type?: ChatRoomType = ChatRoomType.PRIVATE;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  participant_ids?: string[];
}
