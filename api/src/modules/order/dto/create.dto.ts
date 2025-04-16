import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { PAYMENT_METHOD } from '@enums/payment.enum';

class Menu {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  id: string;
}

class PaymentSettingDTO {
  @EnumField(() => PAYMENT_METHOD)
  payment_method: PAYMENT_METHOD;

  @StringFieldOptional({
    property: 'account_name',
    maxLength: 255,
    allowEmpty: false,
  })
  account_name?: string;

  @StringFieldOptional({
    property: 'account_number',
    maxLength: 255,
    allowEmpty: false,
  })
  account_number?: string;
}
export class CreateOrderDTO {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  group_id: string;

  @NumberField({
    max: 20,
  })
  quanlity: number;

  @ArrayField({
    type: () => PaymentSettingDTO,
    isValidateNested: true,
  })
  payment_setting: PaymentSettingDTO[];

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

  @StringFieldOptional({
    maxLength: 255,
    allowEmpty: false,
  })
  invite_code?: string;
}
