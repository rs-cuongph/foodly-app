import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        signOptions: {
          expiresIn: `${configService.get<string>('jwt.expiresIn')}`,
        },
      }),
      inject: [ConfigService],
    }),
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessTokenStrategy],
  exports: [JwtAccessTokenStrategy],
})
export class AuthModule {}
