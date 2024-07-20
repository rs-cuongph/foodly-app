import { ArrayField, EnumField, StringField } from '@guards/field.decorator';
import { MenuItem, OrderGroupType, Prisma } from '@prisma/client';
import { IsBoolean, IsNumber } from 'class-validator';

export class CreateOrderGroupDto implements Prisma.OrderGroupCreateInput {  
  @StringField({
    maxLength: 500,
    allowEmpty: false,
  })
  name: string;

  @StringField({
    allowEmpty: false,
  })
  publicStartTime: Date;

  @StringField({
    allowEmpty: false,
  })
  publicEndTime: Date;

  @IsNumber({
    allowNaN: false,
  })
      price: number;

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => OrderGroupType)
  type: OrderGroupType;

  @ArrayField({
    valueType: 'object',
  })
  menuItems?: Array<MenuItem> | null;

  @IsBoolean()
  isSaveTemplate: boolean;
}