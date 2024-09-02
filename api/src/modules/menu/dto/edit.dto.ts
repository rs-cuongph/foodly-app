import {
  NumberField,
  NumberFieldOptional,
} from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';
import { IsBoolean, IsOptional } from 'class-validator';

export class EditMenuDTO {
  @NumberFieldOptional()
  id?: number;

  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  name: string;

  @NumberField({
    min: 1000,
    max: 10000000,
  })
  price: number;

  @IsBoolean()
  @IsOptional()
  _destroy?: boolean;
}
