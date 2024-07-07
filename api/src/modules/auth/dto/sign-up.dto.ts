import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
export class SignUpDto {
  @IsNotEmpty()
  @MaxLength(50)
  displayName?: string | null;

  @IsNotEmpty()
  @MaxLength(50)
  @IsEmail()
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/, {
    message: 'Password must be at least 8 characters long, contain at least one lowercase letter, one uppercase letter, one digit, and one special character.',
  })
  password: string;

  @IsString()
  confirmPassword: string;

  @ValidateIf(o => o.password !== o.confirmPassword)
  @IsDefined({message: 'Password and Confirm Password do not match'})
  protected readonly passwordAuthentication: string;
}


export class SignUpResponse {
  @IsNotEmpty()
  accessToken?: string;

  @IsNotEmpty()
  refreshToken?: string;
}