import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserPreferencesDto {
  @IsBoolean()
  @IsOptional()
  notifications?: boolean;

  @IsBoolean()
  @IsOptional()
  sound_enabled?: boolean;
}
