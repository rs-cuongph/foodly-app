import { NumberField, StringField } from '@guards/field.decorator';

export class CreateMenuDto {
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
}
