import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}
  async findOneByCondition(condition: Prisma.UserWhereInput): Promise<User> {
    return await this.prisma.user.findFirst({
      where: condition,
    });
  }

  async findUnique(condition: Prisma.UserWhereUniqueInput): Promise<User> {
    return await this.prisma.user.findUnique({
      where: condition,
    });
  }

  async create(dto: Prisma.UserCreateInput): Promise<User> {
    const { displayName, email, password } = dto;
    return await this.prisma.user.create({
      data: {
        displayName,
        email,
        password,
      },
    });
  }

  async update(
    id: string,
    dto: Prisma.UserUpdateInput,
    populate?: Prisma.UserInclude<DefaultArgs>,
  ): Promise<User & any> {
    await this.prisma.user.update({
      where: {
        id: Number(id),
        deletedAt: null,
      },
      data: dto,
      include: populate,
    });
  }
}
