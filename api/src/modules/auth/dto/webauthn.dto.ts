import { StringField } from '@decorators/validation/string.decorator';
import {
  RegistrationJSON,
  AuthenticationResponseJSON,
} from '@passwordless-id/webauthn/dist/esm/types';
import { IsObject } from 'class-validator';

export class WebAuthnVerifyRegistrationDTO {
  @IsObject()
  registration: RegistrationJSON;

  @StringField({
    allowEmpty: false,
    maxLength: 255,
  })
  challenge: string;
}

export class WebAuthnVerifyAuthenticationDTO {
  @IsObject()
  authentication: AuthenticationResponseJSON;

  @StringField({
    allowEmpty: false,
    maxLength: 255,
  })
  challenge: string;
}
