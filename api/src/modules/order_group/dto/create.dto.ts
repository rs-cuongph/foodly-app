import { ArrayField, EnumField, StringField } from '@guards/field.decorator';
import { MenuItem, OrderGroupType, Prisma } from '@prisma/client';
// import { Transform } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class CreateOrderGroupDto implements Prisma.OrderGroupCreateInput {
  @StringField({
    maxLength: 500,
    allowEmpty: false,
  })
  name: string;

  @StringField(
    {
      allowEmpty: false,
      isDate: true,
      dateOptions: {
        maxDate: 'now',
        smallerThan: 'publicEndTime',
      },
    },
    ['publicStartTime', 'publicEndTime'],
  )
  publicStartTime: Date;

  @StringField(
    {
      allowEmpty: false,
      isDate: true,
      dateOptions: {
        maxDate: 'now',
      },
    },
    ['publicEndTime'],
  )
  publicEndTime: Date;

  @StringField({
    isStringNumber: false,
    min: 1000,
    max: 10000000,
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
  isSaveTemplate?: boolean = false;
}
