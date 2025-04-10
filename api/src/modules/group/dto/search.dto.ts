import {
  ArrayField,
  ArrayFieldOptional,
} from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { GroupStatus, ShareScope } from '@prisma/client';
import { Transform } from 'class-transformer';

export class SearchGroupDTO {
  @StringField({
    isStringNumber: true,
  })
  page: string;

  @StringField({
    isStringNumber: true,
  })
  size: string;

  @StringFieldOptional({
    maxLength: 255,
  })
  keyword?: string;

  @StringFieldOptional({
    maxLength: 255,
  })
  sort?: string;

  @StringFieldOptional({})
  is_online?: number | string;

  @ArrayFieldOptional({
    enumType: ShareScope,
  })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  share_scope?: ShareScope[];

  @ArrayFieldOptional({
    enumType: GroupStatus,
  })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : [value];
  })
  status?: GroupStatus[];

  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  is_mine?: number;
}
