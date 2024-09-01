/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { OrderGroupService } from './order_group.service';
import { OrderGroupController } from './order_group.controller';

@Module({
  imports: [],
  controllers: [OrderGroupController],
  providers: [OrderGroupService],
  exports: [OrderGroupService],
})
export class OrderGroupModule {}
