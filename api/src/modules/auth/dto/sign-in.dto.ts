import { NumberField } from '@decorators/validation/number.decorator';
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

  @NumberField({})
  organization_id: number;
}
