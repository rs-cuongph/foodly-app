import { ArrayFieldOptional } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { StringField } from '@decorators/validation/string.decorator';
import { PAYMENT_METHOD } from '@enums/payment.enum';

export class PaymentSettingDTO {
  @EnumField(() => PAYMENT_METHOD)
  payment_method: PAYMENT_METHOD;

  @StringField({
    property: 'account_name',
    maxLength: 255,
    allowEmpty: false,
  })
  account_name: string;

  @StringField({
    property: 'account_number',
    maxLength: 255,
    allowEmpty: false,
  })
  account_number: string;
}

export class CreateTransactionDTO {
  @ArrayFieldOptional({
    type: () => PaymentSettingDTO,
    isValidateNested: true,
  })
  payment_setting: PaymentSettingDTO;

  @StringField({
    property: 'order_id',
    maxLength: 255,
    allowEmpty: false,
  })
  order_id: string;

  // @StringField({
  //   property: 'callback_url',
  //   maxLength: 255,
  //   allowEmpty: false,
  // })
  // callback_url: string;
}

export class ScanTransactionDTO {
  @StringField({
    property: 'qr_text',
    maxLength: 255,
    allowEmpty: false,
  })
  qr_text: string;
}
