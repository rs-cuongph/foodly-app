import { StringField } from '@decorators/validation/string.decorator';

export class RequestLoginCodeDTO {
  @StringField({
    email: true,
    maxLength: 255,
    allowEmpty: false,
  })
  email: string;

  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  organization_code: string;
}

export class ResendLoginCodeDTO {
  @StringField({
    email: true,
    maxLength: 255,
    allowEmpty: false,
  })
  email: string;

  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  organization_code: string;
}

export class VerifyLoginCodeDTO {
  @StringField({
    email: true,
    maxLength: 255,
    allowEmpty: false,
  })
  email: string;

  @StringField({
    maxLength: 6,
    minLength: 6,
    allowEmpty: false,
  })
  code: string;

  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  organization_code: string;
}
