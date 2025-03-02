import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtAccessTokenStrategy } from './strategies/jwt-access-token.strategy';
import { SharedModule } from '@shared/shared.module';

@Module({
  imports: [JwtModule.register({}), SharedModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtAccessTokenStrategy],
  exports: [JwtAccessTokenStrategy],
})
export class AuthModule {}
