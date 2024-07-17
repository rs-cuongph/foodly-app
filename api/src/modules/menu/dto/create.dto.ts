import { EnumField, StringField } from '@guards/field.decorator';

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

  @StringField({
    allowEmpty: false,
  })
  discount: Number;

  @StringField({
    allowEmpty: false,
  })
  orderGroupId: string;

  @StringField({
    allowEmpty: false,
  })
  createdById: string;
}
