import { StringField } from '@decorators/validation/string.decorator';

export class SignUpDTO {
  @StringField({
    property: 'display_name',
    maxLength: 255,
    allowEmpty: false,
  })
  display_name: string;

  @StringField({
    property: 'email',
    email: true,
    maxLength: 255,
    allowEmpty: false,
  })
  email: string;

  @StringField({
    property: 'password',
    maxLength: 255,
    allowEmpty: false,
    password: true,
  })
  password: string;

  @StringField({
    property: 'confirm_password',
    maxLength: 255,
    allowEmpty: false,
    password: true,
    sameAs: 'password',
  })
  confirm_password: string;

  @StringField({
    property: 'organization_code',
    maxLength: 16,
    allowEmpty: false,
  })
  organization_code: string;
}
