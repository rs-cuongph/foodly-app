import { StringField } from '@guards/field.decorator';
import { IsNotEmpty } from 'class-validator';
export class SignUpDto {
  @StringField({
    maxLength: 50,
    allowEmpty: false,
  })
  displayName: string;

  @StringField({
    email: true,
    maxLength: 50,
    allowEmpty: false,
  })
  email: string;

  @StringField({
    maxLength: 50,
    allowEmpty: false,
    password: true,
  })
  password: string;

  @StringField(
    {
      maxLength: 50,
      allowEmpty: false,
      password: true,
      passwordConfirm: true,
    },
    ['Confirm Password', 'Password'],
    'password',
  )
  confirmPassword: string;
}

export class SignUpResponse {
  @IsNotEmpty()
  accessToken?: string;

  @IsNotEmpty()
  refreshToken?: string;
}
