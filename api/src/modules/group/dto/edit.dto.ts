import { ArrayField } from '@decorators/validation/array.decorator';
import { EnumField } from '@decorators/validation/enum.decorator';
import { NumberField } from '@decorators/validation/number.decorator';
import {
  StringField,
  StringFieldOptional,
} from '@decorators/validation/string.decorator';
import { EditMenuDTO } from '@modules/menu/dto/edit.dto';
import { GroupType, ShareScope } from '@prisma/client';
import { IsBoolean } from 'class-validator';

export class EditGroupDTO {
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
    max: 10000000,
  })
  price: number;

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => GroupType)
  type: GroupType;

  @ArrayField({
    type: () => EditMenuDTO,
    isValidateNested: true,
    minLength: 1,
  })
  menu_items: EditMenuDTO[];

  @StringField({
    allowEmpty: false,
  })
  @EnumField(() => ShareScope)
  share_scope: ShareScope;

  @IsBoolean()
  is_save_template: boolean;

  @StringFieldOptional({
    maxLength: 255,
  })
  invite_code: string;
}
