import { ValidateMenuItemPrice } from '@decorators/validation/group-price.decorator';
import { StringField } from '@decorators/validation/string.decorator';

export class CreateMenuDTO {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  name: string;

  @ValidateMenuItemPrice()
  price: number;
}
