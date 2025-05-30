import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { CreateMenuDTO } from '@modules/menu/dto/create.dto';
import { GroupType, ShareScope } from '@prisma/client';
import { IsBoolean, ValidateIf } from 'class-validator';

export class CreateGroupDTO {
  @StringField({
    maxLength: 255,
  })
  name: string;

  @StringFieldOptional({
    isDate: true,
    dateOptions: {
      maxDate: 'public_time_end',
    },
  })
  public_start_time: Date;

  @StringFieldOptional({
    isDate: true,
  })
  public_end_time: Date;

  @NumberField({
    min: 1000,
    max: 10000000,
  })
  @ValidateIf((object) => {
    return !object.menu_items?.length;
  })
  price: number;

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => GroupType)
  type: GroupType;

  @ArrayField({
    type: () => CreateMenuDTO,
    isValidateNested: true,
    minLength: 1,
  })
  menu_items: CreateMenuDTO[];

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => ShareScope)
  share_scope: ShareScope;

  @IsBoolean()
  is_save_template: boolean;
}
