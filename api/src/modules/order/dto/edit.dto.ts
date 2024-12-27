import { ArrayField } from '@decorators/validation/array.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';

class Menu {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  id: string;
}
export class EditOrderDTO {
  @StringField({
    maxLength: 255,
    allowEmpty: true,
  })
  note?: string;

  @NumberField({
    max: 10,
  })
  quanlity: number;

  @ArrayField({
    type: () => Menu,
    isValidateNested: true,
    minLength: 1,
  })
  menu: Menu[];
}

export class MarkPaidDTO {}

export class MarkPaidAllDTO {
  @ArrayField({
    isValidateNested: true,
    minLength: 1,
  })
  ids: string[];
}

export class ConfirmPaidAllDTO {
  @ArrayField({
    isValidateNested: true,
    minLength: 1,
  })
  ids: string[];
}

export class ConfirmPaidDTO {
  @StringField({
    maxLength: 255,
  })
  qr_code: string;
}
