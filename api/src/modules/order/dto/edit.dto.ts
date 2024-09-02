import { ArrayField } from '@decorators/validation/array.decorator';
import { NumberField } from '@decorators/validation/number.decorator';

class Menu {
  @NumberField()
  id: number;
}
export class EditOrderDTO {
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
    isNumber: true,
    isValidateNested: true,
    minLength: 1,
  })
  ids: number[];
}

export class ConfirmPaidAllDTO {
  @ArrayField({
    isNumber: true,
    isValidateNested: true,
    minLength: 1,
  })
  ids: number[];
}

export class ConfirmPaidDTO {}
