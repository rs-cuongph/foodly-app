import { StringField } from '@decorators/validation/string.decorator';

export class SignUpDto {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  display_name: string;

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

  @StringField({
    maxLength: 255,
    allowEmpty: false,
    password: true,
    sameAs: 'password',
  })
  confirm_password: string;
}
