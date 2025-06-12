import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateRoomDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}
