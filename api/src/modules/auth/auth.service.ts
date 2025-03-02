import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SignUpDTO } from './dto/sign-up.dto';
import { TokenPayload } from './interfaces/token.interface';
import {
  access_token_private_key,
  refresh_token_private_key,
} from '@constants/jwt.constraints';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from '@enums/token.enum';
import { RequestWithUser } from 'src/types/requests.type';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { omit } from 'lodash';
import { Prisma } from '@prisma/client';
import { I18nService } from 'nestjs-i18n';
import * as dayjs from 'dayjs';
import {
  UpdateUserInfoDTO,
  UpdateUserPasswordDTO,
} from './dto/update-user-info.dto';
import { ResetPasswordDTO, SetPasswordDTO } from './dto/reset-password.dto';
import { generateToken } from '@utils/helper';
import { MailService } from '@shared/mail/mail.service';
@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    private i18n: I18nService,
    private mailService: MailService,
  ) {}

  async findUser(condition: Prisma.UserWhereInput) {
    return this.prismaService.client.user.findFirst({
      where: condition,
    });
  }

  async findOrganization(condition: Prisma.OrganizationWhereInput) {
    return this.prismaService.client.organization.findFirst({
      where: condition,
    });
  }

  async signUp(body: SignUpDTO) {
    const { email, organization_code, password, display_name } = body;
    try {
      const existedUser = await this.findUser({
        email,
      });
      if (existedUser) {
        throw new ConflictException('Email already existed!');
      }

      const existedOrganization = await this.findOrganization({
        code: organization_code,
      });
      if (!existedOrganization) {
        throw new BadRequestException('Organization not found!');
      }

      const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);
      const user = await this.prismaService.client.user.create({
        data: {
          organization: {
            connect: {
              code: organization_code,
            },
          },
          email,
          display_name,
          password: hashedPassword,
        },
      });
      const access_token = this.generateAccessToken({
        userId: user.id,
      });
      const refresh_token = this.generateRefreshToken({
        userId: user.id,
      });

      const decodedToken = this.jwtService.decode(access_token) as {
        [key: string]: any;
      };
      const iat = decodedToken?.iat;
      const exp = decodedToken?.exp;
      return {
        iat,
        exp,
        type: TokenType.BEARER,
        user_id: user.id,
        organization_id: user.organization_id,
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async signIn(user: RequestWithUser['user']) {
    try {
      const access_token = this.generateAccessToken({
        userId: user.id,
      });
      const refresh_token = this.generateRefreshToken({
        userId: user.id,
      });
      const decodedToken = this.jwtService.decode(access_token) as {
        [key: string]: any;
      };
      const iat = decodedToken?.iat;
      const exp = decodedToken?.exp;
      return {
        iat,
        exp,
        type: TokenType.BEARER,
        user_id: user.id,
        organization_id: user.organization_id,
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(
    email: string,
    password: string,
    organization_code: string,
  ) {
    const user = await this.findUser({
      email,
      organization: {
        code: organization_code,
      },
    });

    if (!user) {
      throw new BadRequestException(this.i18n.t('message.wrong_account'));
    }

    const is_matching = await bcrypt.compare(password, user.password);
    if (!is_matching) {
      throw new BadRequestException(this.i18n.t('message.wrong_account'));
    }

    if (user.block_to && dayjs().isBefore(user.block_to)) {
      throw new BadRequestException(this.i18n.t('message.locked'));
    }
    return user;
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${this.configService.get<string>('jwt.refreshIn')}`,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.configService.get<string>('jwt.refreshIn')}`,
    });
  }

  async getUserInfo(user: RequestWithUser['user']) {
    return omit(user, ['password']);
  }

  async updateUserInfo(body: UpdateUserInfoDTO, user: RequestWithUser['user']) {
    const currentInfo = await this.prismaService.client.user.findUnique({
      where: {
        id: user.id,
      },
    });
    return this.prismaService.client.user.update({
      where: {
        id: user.id,
      },
      data: {
        display_name: body.display_name || currentInfo?.display_name,
        payment_setting: body.payment_setting,
      },
      select: {
        id: true,
        display_name: true,
        payment_setting: true,
      },
    });
  }

  async updateUserPassword(
    body: UpdateUserPasswordDTO,
    user: RequestWithUser['user'],
  ) {
    const is_matching = await bcrypt.compare(body.password, user.password);

    if (!is_matching) {
      throw new BadRequestException(this.i18n.t('message.wrong_password'));
    }

    const hashedNewPassword = await bcrypt.hash(
      body.new_password,
      this.SALT_ROUND,
    );

    return this.prismaService.client.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });
  }

  async resetPassword(body: ResetPasswordDTO) {
    const { email, organization_code } = body;
    const user = await this.findUser({
      email,
      organization: {
        code: organization_code,
      },
    });
    if (!user) {
      throw new BadRequestException(this.i18n.t('message.user_not_found'));
    }

    if (user.block_to) {
      throw new BadRequestException(this.i18n.t('message.locked'));
    }

    const resetToken = generateToken();
    const resetTokenExpiresAt = dayjs().add(1, 'day').toDate();

    await this.prismaService.client.user.update({
      where: { id: user.id },
      data: {
        reset_password_token: resetToken,
        reset_password_token_expires_at: resetTokenExpiresAt,
      },
    });

    await this.mailService.sendPasswordResetMail(user.email, resetToken);
  }

  async verifyResetPasswordToken(token: string) {
    const user = await this.prismaService.client.user.findFirst({
      where: { reset_password_token: token },
    });
    if (!user) {
      throw new BadRequestException(this.i18n.t('message.invalid_token'));
    }

    if (
      user.reset_password_token_expires_at &&
      dayjs().isAfter(user.reset_password_token_expires_at)
    ) {
      throw new BadRequestException(this.i18n.t('message.token_expired'));
    }

    return {
      id: user.id,
    };
  }

  async setPassword(body: SetPasswordDTO) {
    const { token, new_password } = body;
    const user = await this.prismaService.client.user.findFirst({
      where: { reset_password_token: token },
    });

    if (!user) {
      throw new BadRequestException(this.i18n.t('message.invalid_token'));
    }

    if (user.block_to) {
      throw new BadRequestException(this.i18n.t('message.locked'));
    }

    if (
      user.reset_password_token_expires_at &&
      dayjs().isAfter(user.reset_password_token_expires_at)
    ) {
      throw new BadRequestException(this.i18n.t('message.token_expired'));
    }

    const hashedPassword = await bcrypt.hash(new_password, this.SALT_ROUND);

    await this.prismaService.client.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        reset_password_token: null,
        reset_password_token_expires_at: null,
      },
    });

    return {
      id: user.id,
    };
  }
}
