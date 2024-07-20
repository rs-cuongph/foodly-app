import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '@modules/user/user.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';

@Module({
  imports: [UserModule, JwtModule.register({})],
  controllers: [AuthController],

  providers: [AuthService, LocalStrategy, JwtAccessTokenStrategy],
  exports: [JwtAccessTokenStrategy],
})
export class AuthModule {}
