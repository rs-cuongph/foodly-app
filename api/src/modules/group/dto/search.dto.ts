import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';

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

  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  is_online?: number;

  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  is_mine?: number;
}
