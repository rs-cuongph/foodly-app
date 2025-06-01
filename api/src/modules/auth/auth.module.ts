import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { SharedModule } from '@shared/shared.module';
import { GoogleStrategy } from './strategies/google.strategy';
@Module({
  imports: [JwtModule, SharedModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessTokenStrategy,
    GoogleStrategy,
  ],
  exports: [JwtAccessTokenStrategy],
})
export class AuthModule {}
