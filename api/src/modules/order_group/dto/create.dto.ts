import {
  ArrayField,
  EnumField,
  NumberField,
  StringField,
} from '@guards/field.decorator';
import { CreateMenuDto } from '@modules/menu/dto/create.dto';
import { OrderGroupType, Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
// import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, ValidateNested } from 'class-validator';

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

  @NumberField({
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
  @ValidateNested({ each: true })
  @Type(() => CreateMenuDto)
  menuItems?: Array<CreateMenuDto> | null;

  @IsBoolean()
  isSaveTemplate?: boolean = false;
}

export class OrderGroupResponse {
  @IsNotEmpty()
  message?: string;

  @IsNotEmpty()
  data?: object;
}
