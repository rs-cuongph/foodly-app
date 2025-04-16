import { ValidateMenuItemPrice } from '@decorators/validation/group-price.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { IsBoolean, IsOptional, ValidateIf } from 'class-validator';

export class EditMenuDTO {
  @StringFieldOptional({
    maxLength: 255,
  })
  id?: string;

  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  @ValidateIf((object) => {
    return !object._destroy;
  })
  name: string;

  @ValidateMenuItemPrice()
  @ValidateIf((object) => {
    return !object._destroy;
  })
  price: number;

  @IsBoolean()
  @IsOptional()
  _destroy?: boolean;
}
