import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import { StringField } from '@decorators/validation/string.decorator';
import { CreateMenuDto } from '@modules/menu/dto/create.dto';
import { OrderGroupType } from '@prisma/client';
import { IsBoolean } from 'class-validator';

export class CreateOrderGroupDto {
  @StringField({
    maxLength: 255,
  })
  name: string;

  @StringField({
    isDate: true,
    dateOptions: {
      maxDate: 'public_end_time',
    },
  })
  public_start_time: Date;

  @StringField({
    isDate: true,
  })
  public_end_time: Date;

  @NumberField({
    max: 10000000,
  })
  price: number;

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => OrderGroupType)
  type: OrderGroupType;

  @ArrayField({
    type: () => CreateMenuDto,
    isValidateNested: true,
  })
  menu_items: CreateMenuDto[];

  @IsBoolean()
  is_save_template: boolean;
}
