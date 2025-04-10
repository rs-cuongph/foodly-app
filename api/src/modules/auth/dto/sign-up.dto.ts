import { StringField } from '@decorators/validation/string.decorator';
import { IsEmailUnique } from '@decorators/validation/email-unique/email-unique.decorator';
import { ExistsInEntity } from '@decorators/validation/exists-in-entity/exists-in-entity.decorator';

export class SignUpDTO {
  @StringField({
    property: 'display_name',
    maxLength: 255,
    allowEmpty: false,
  })
  display_name: string;

  @StringField({
    property: 'email',
    email: true,
    maxLength: 255,
    allowEmpty: false,
  })
  @IsEmailUnique()
  email: string;

  @StringField({
    property: 'password',
    maxLength: 255,
    allowEmpty: false,
    password: true,
  })
  password: string;

  @StringField({
    property: 'confirm_password',
    maxLength: 255,
    allowEmpty: false,
    password: true,
    sameAs: 'password',
  })
  confirm_password: string;

  @StringField({
    property: 'organization_code',
    maxLength: 16,
    allowEmpty: false,
  })
  @ExistsInEntity({
    entity: 'organization',
    property: 'code',
  })
  organization_code: string;
}
