import { StringField } from '@decorators/validation/string.decorator';

export class ResetPasswordDTO {
  @StringField({
    email: true,
    maxLength: 255,
  })
  email: string;

  @StringField({
    allowEmpty: false,
    maxLength: 255,
  })
  organization_code: string;
}

export class SetPasswordDTO {
  @StringField({
    allowEmpty: false,
    minLength: 6,
    maxLength: 255,
    password: true,
  })
  new_password: string;

  @StringField({
    allowEmpty: false,
  })
  token: string;
}
