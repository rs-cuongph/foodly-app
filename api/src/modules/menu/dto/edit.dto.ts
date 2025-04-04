import { NumberField } from '@decorators/validation/number.decorator';
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

  @NumberField({
    min: 1000,
    max: 10000000,
  })
  price: number;

  @IsBoolean()
  @IsOptional()
  _destroy?: boolean;
}
