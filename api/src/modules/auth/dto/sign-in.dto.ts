import { StringField } from '@decorators/validation/string.decorator';

export class SignInDto {
  @StringField({
    email: true,
    maxLength: 255,
    allowEmpty: false,
  })
  email: string;

  @StringField({
    maxLength: 255,
    allowEmpty: false,
    password: true,
  })
  password: string;
}
