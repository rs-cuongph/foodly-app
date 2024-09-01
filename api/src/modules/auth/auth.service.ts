import * as bcrypt from 'bcryptjs';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenPayload } from './interfaces/token.interface';
import {
  access_token_private_key,
  refresh_token_private_key,
} from '@constants/jwt.constraints';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenType } from 'src/enums/token.enum';
import { RequestWithUser } from 'src/types/requests.type';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { omit } from 'lodash';

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async findUserByEmail(email: string) {
    return this.prismaService.client.user.findFirst({
      where: {
        email,
      },
    });
  }

  async findUserById(id: number) {
    return this.prismaService.client.user.findFirst({
      where: {
        id,
      },
    });
  }

  async signUp(signUpDto: SignUpDto) {
    const { email } = signUpDto;
    try {
      const existedUser = await this.findUserByEmail(email);
      if (existedUser) {
        throw new ConflictException('Email already existed!');
      }

      const hashedPassword = await bcrypt.hash(
        signUpDto.password,
        this.SALT_ROUND,
      );
      const user = await this.prismaService.client.user.create({
        data: {
          email: signUpDto.email,
          display_name: signUpDto.display_name,
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
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async signIn(userId: string) {
    try {
      const access_token = this.generateAccessToken({
        userId,
      });
      const refresh_token = this.generateRefreshToken({
        userId,
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
        user_id: userId,
        access_token,
        refresh_token,
      };
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.findUserByEmail(email);
      // if (user?.blockTo && isBefore(new Date(), user.blockTo)) {
      //   throw new BadRequestException(
      //     'This user be blocked by admin, please contact admin to unlock',
      //   );
      // }
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException(
        error?.response?.message || 'Wrong credentials!!',
      );
    }
  }

  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = await bcrypt.compare(plain_text, hashed_text);
    if (!is_matching) {
      throw new BadRequestException();
    }
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
}
