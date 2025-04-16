import { ValidateMenuItemPrice } from '@decorators/validation/group-price.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { IsBoolean, IsOptional } from 'class-validator';

export class EditMenuDTO {
  @StringFieldOptional({
    maxLength: 255,
  })
  id?: string;

  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  name: string;

  @ValidateMenuItemPrice()
  price: number;

  @IsBoolean()
  @IsOptional()
  _destroy?: boolean;
}
