import { UserService } from '@modules/users/user.service';
import * as bcrypt from 'bcryptjs';
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { TokenPayload } from './interfaces/token.interface';
import { access_token_private_key, refresh_token_private_key } from '@constants/jwt.constraints';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    private readonly UserService: UserService,
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) { }
  async signUp(signUpDto: SignUpDto) {
    try {
      const existedUser = await this.UserService.findOneByCondition(signUpDto.email);
      if (existedUser) {
        throw new ConflictException('Email already existed!!');
      }

      const hashedPassword = await bcrypt.hash(
        signUpDto.password,
        this.SALT_ROUND,
      );
      const user = await this.UserService.createUser({
        ...signUpDto,
        password: hashedPassword,
      });
      const refreshToken = this.generateRefreshToken({
        userId: user.id.toString(),
      });
      await this.storeRefreshToken(user.id.toString(), refreshToken);
      return {
        accessToken: this.generateAccessToken({
          userId: user.id.toString(),
        }),
        refreshToken,
      };
    } catch (error) {
      throw error;
    }
  }

  generateAccessToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  generateRefreshToken(payload: TokenPayload) {
    return this.jwtService.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  async storeRefreshToken(userId: string, token: string): Promise<void> {
    try {
      const hashedToken = await bcrypt.hash(token, this.SALT_ROUND);
      await this.UserService.setCurrentRefreshToken(userId, hashedToken);
    } catch (error) {
      throw error;
    }
  }

}
