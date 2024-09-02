import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { PAYMENT_METHOD } from 'src/enums/payment.enum';

class Menu {
  @NumberField()
  id: number;
}
export class CreateOrderDTO {
  @NumberField()
  group_id: number;

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
}
