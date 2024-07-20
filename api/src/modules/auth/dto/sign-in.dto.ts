import { StringField } from '@guards/field.decorator';
import {
  IsNotEmpty,
} from 'class-validator';
export class SignInDto {
  @StringField({
    email: true,
    maxLength: 50,
    allowEmpty: false
  })
  email: string;

  @StringField({
    maxLength: 50,
    allowEmpty: false,
    password: true,
  })
  password: string;
}


export class SignInResponse {
  @IsNotEmpty()
  userId?: string;

  @IsNotEmpty()
  exp?: number;

  @IsNotEmpty()
  iat?: number;

  @IsNotEmpty()
  accessToken?: string;

  @IsNotEmpty()
  refreshToken?: string;
}