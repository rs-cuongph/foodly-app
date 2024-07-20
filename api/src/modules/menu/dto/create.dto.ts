import { StringField } from '@guards/field.decorator';

export enum GROUP_TYPE {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export class CreateMenuDto {
  @StringField({
    maxLength: 255,
    allowEmpty: false,
  })
  name: string;

  @StringField({
    allowEmpty: false,
  })
  price: Number;
}
