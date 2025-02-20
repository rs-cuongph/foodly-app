import { StringField } from '@decorators/validation/string.decorator';

export class SignInDTO {
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
  })
  organization_code: string;
}
