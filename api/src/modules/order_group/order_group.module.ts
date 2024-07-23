/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { OrderGroupService } from './order_group.service';
import { orderGroupRepository } from './order_group.repository';
import { OrderGroupController } from './order_group.controller';
import { UserModule } from '@modules/user/user.module';
import { access_token_public_key } from '@constants/jwt.constraints';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    JwtModule.register({
      secret: access_token_public_key,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [OrderGroupController],
  providers: [
    OrderGroupService,
    { provide: 'OrderGroupInterface', useClass: orderGroupRepository },
  ],
  exports: [OrderGroupService],
})
export class OrderGroupModule {}
