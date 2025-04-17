import { NumberField } from '@decorators/validation/number.decorator';
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

  @NumberField({
    min: 0,
    max: 10000000,
  })
  price: number;

  @IsBoolean()
  @IsOptional()
  _destroy?: boolean;
}
