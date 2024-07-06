import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
export class SignUpDto {
  @IsOptional()
  @MaxLength(50)
  displayName?: string | null;

  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  password: string;
}


export class SignUpResponse {
  @IsNotEmpty()
  accessToken?: string;

  @IsNotEmpty()
  refreshToken?: string;
}