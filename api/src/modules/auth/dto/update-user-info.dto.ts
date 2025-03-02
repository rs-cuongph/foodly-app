import { ArrayFieldOptional } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { PAYMENT_METHOD } from '@enums/payment.enum';

export class UpdateUserInfoDTO {
  @ArrayFieldOptional({
    type: () => PaymentSettingDTO,
    isValidateNested: true,
  })
  payment_setting?: PaymentSettingDTO[];

  @StringFieldOptional({
    property: 'display_name',
    maxLength: 255,
    allowEmpty: false,
  })
  display_name?: string;
}

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

export class UpdateUserPasswordDTO {
  @StringField({
    property: 'password',
    maxLength: 255,
    allowEmpty: false,
  })
  password: string;

  @StringField({
    property: 'new_password',
    maxLength: 255,
    allowEmpty: false,
  })
  new_password: string;
}
