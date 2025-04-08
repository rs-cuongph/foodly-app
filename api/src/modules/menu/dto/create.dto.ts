import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';
import { ValidateIf } from 'class-validator';

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
  @ValidateIf((object: any) => {
    // This will only be validated when group price is 0
    return object.price === 0;
  })
  price: number;
}
