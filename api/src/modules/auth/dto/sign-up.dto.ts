import { StringField } from '@decorators/validation/string.decorator';

export class SignUpDTO {
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

  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  organization_id: string;
}
