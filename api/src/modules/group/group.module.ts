/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';

@Module({
  imports: [],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [GroupService],
})
export class GroupModule {}
