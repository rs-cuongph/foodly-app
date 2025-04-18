import { ArrayField } from '@decorators/validation/array.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';

class Menu {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  id: string;
}
export class EditOrderDTO {
  @StringField({
    maxLength: 500,
    allowEmpty: true,
  })
  note?: string;

  @NumberField({
    max: 20,
  })
  quantity: number;

  @ArrayField({
    type: () => Menu,
    isValidateNested: true,
    minLength: 1,
  })
  menu: Menu[];

  @StringFieldOptional({
    maxLength: 500,
    allowEmpty: false,
  })
  invite_code?: string;
}

export class MarkPaidDTO {}

export class MarkPaidAllDTO {
  @ArrayField({
    minLength: 0,
  })
  include_ids: string[];

  @ArrayField({
    minLength: 0,
  })
  exclude_ids: string[];
}

export class ConfirmPaidAllDTO {
  @ArrayField({
    minLength: 0,
  })
  include_ids: string[];

  @ArrayField({
    minLength: 0,
  })
  exclude_ids: string[];
}

export class ConfirmPaidDTO {
  @StringField({
    maxLength: 255,
  })
  qr_code: string;
}

export class CancelOrderDTO {
  @StringField({
    maxLength: 500,
    allowEmpty: true,
  })
  reason: string;
}
