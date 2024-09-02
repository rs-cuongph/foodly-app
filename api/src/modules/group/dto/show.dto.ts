import { StringFieldOptional } from '@decorators/validation/string.decorator';

export class QueryShowGroupDTO {
  @StringFieldOptional({
    isStringNumber: true,
    transformTo: true,
    transformOptions: {
      toInt: true,
    },
  })
  with_orders?: number;
}
