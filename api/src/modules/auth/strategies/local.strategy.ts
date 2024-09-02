import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SignInDTO } from '../dto/sign-in.dto';
import { plainToClass } from 'class-transformer';
import { validate as classValidate } from 'class-validator';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private i18n: I18nService,
  ) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    const body = plainToClass(SignInDTO, req.body);
    const errors = await classValidate(body);
    if (errors.length) {
      throw new BadRequestException(
        this.i18n.t('message.wrong_credential_format'),
      );
    } else {
      const { organization_id, email, password } = req.body;
      const user = await this.authService.getAuthenticatedUser(
        email,
        password,
        organization_id,
      );

      return user;
    }
  }
}
