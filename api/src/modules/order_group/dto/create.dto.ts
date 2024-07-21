import { ArrayField, EnumField, StringField } from '@guards/field.decorator';
import { MenuItem, OrderGroupType, Prisma } from '@prisma/client';
// import { Transform } from 'class-transformer';
import { IsBoolean, IsNumber } from 'class-validator';

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
      dateOption: {
        minDate: new Date('2024-07-21T07:00:44.005Z'),
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
      dateOption: {
        minDate: new Date('2024-07-21T07:00:44.005Z'),
      },
    },
    ['publicEndTime'],
  )
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
