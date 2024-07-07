/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    UserService,
    { provide: 'UserInterface', useClass: UserRepository },
  ],
  exports: [
    UserService
  ]
})
export class UserModule { }
