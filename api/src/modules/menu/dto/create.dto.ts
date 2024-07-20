import { StringField } from '@guards/field.decorator';

export class CreateMenuDto {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  name: string;

  @StringField({
    allowEmpty: false,
  })
  price: number;
}
