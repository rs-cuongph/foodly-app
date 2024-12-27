import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';
import { PAYMENT_METHOD } from 'src/enums/payment.enum';

class Menu {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  id: string;
}
export class CreateOrderDTO {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  group_id: string;

  @NumberField({
    max: 10,
  })
  quanlity: number;

  @EnumField(() => PAYMENT_METHOD)
  payment_method: PAYMENT_METHOD;

  @ArrayField({
    type: () => Menu,
    isValidateNested: true,
    minLength: 1,
  })
  menu: Menu[];

  @StringField({
    maxLength: 255,
    allowEmpty: true,
  })
  note?: string;
}
