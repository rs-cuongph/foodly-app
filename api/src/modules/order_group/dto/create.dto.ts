import { ArrayField, EnumField, StringField } from '@guards/field.decorator';
import { Prisma } from '@prisma/client';

export enum GROUP_TYPE {
  AUTO = 'auto',
  MANUAL = 'manual',
}

export class CreateOrderGroupDto {
  @StringField({
    maxLength: 500,
    allowEmpty: false,
  })
  groupName: string;

  @StringField({
    allowEmpty: false,
  })
  publicStartTime: Date;

  @StringField({
    allowEmpty: false,
  })
  publicEndTime: Date;

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => GROUP_TYPE)
  type: GROUP_TYPE;

  @ArrayField({
    valueType: 'object',
  })
  menuItems?: Array<Object> | null;
}