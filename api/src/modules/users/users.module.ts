/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    UsersService,
    { provide: 'UsersInterface', useClass: UsersRepository },
  ],
  exports: [
    UsersService
  ]
})
export class UsersModule { }
