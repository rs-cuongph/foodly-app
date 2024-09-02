import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class CreateMenuDTO {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  name: string;

  @NumberField({
    min: 1000,
    max: 10000000,
  })
  price: number;
}
