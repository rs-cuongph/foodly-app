import {
  ArrayField,
  EnumField,
  NumberField,
  StringField,
} from '@guards/field.decorator';
import { CreateMenuDto } from '@modules/menu/dto/create.dto';
import { OrderGroupType, Prisma, ShareScope } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

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

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => ShareScope)
  shareScope?: ShareScope;

  @ArrayField({
    valueType: 'number',
  })
  inviteds?: Array<number>;
}

export class OrderGroupResponse {
  @IsNotEmpty()
  message?: string;

  @IsNotEmpty()
  data?: object;
}

export class InviteUsersDto {
  @IsInt()
  @IsNotEmpty()
  orderGroupId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsInt({ each: true })
  userIds: number[];
}
