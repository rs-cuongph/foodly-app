import { ArrayFieldOptional } from '@decorators/validation/array.decorator';
import { EnumFieldOptional } from '@decorators/validation/enum.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { Transform, Type } from 'class-transformer';
import { PAYMENT_METHOD } from '@enums/payment.enum';
import { ORDER_STATUS_ENUM } from '@enums/status.enum';
import { ToInt } from '@decorators/validation/transform.decorator';

export class SearchOrderDTO {
  @StringField({
    isStringNumber: true,
  })
  page: string;

  @StringField({
    isStringNumber: true,
  })
  size: string;

  @EnumFieldOptional(() => PAYMENT_METHOD)
  @Transform((params) => {
    if (params.value) return params.value;
    return undefined;
  })
  payment_method?: PAYMENT_METHOD;

  @ArrayFieldOptional({
    allowEmpty: true,
    enumType: ORDER_STATUS_ENUM,
  })
  statuses?: ORDER_STATUS_ENUM[];

  @StringFieldOptional({
    maxLength: 255,
  })
  sort?: string;

  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  is_online?: number;

  @Transform(({ value }) => (value ? Number(value) : undefined))
  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  is_mine?: number;

  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  is_mine_group?: number;

  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  with_group?: number;

  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  with_created_by?: number;

  @StringFieldOptional()
  group_id?: string;

  @StringFieldOptional({
    maxLength: 255,
  })
  keyword?: string;
}
