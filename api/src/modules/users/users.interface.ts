import { Prisma, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export interface UsersInterface {
  findOneByCondition(condition: Prisma.UserWhereUniqueInput): Promise<User>;
  create(dto: Prisma.UserCreateInput): Promise<User>;
  update(
    id: string,
    dto: Prisma.UserUpdateInput,
    populate?: Prisma.UserInclude<DefaultArgs>,
  ): Promise<User & any>;
}
