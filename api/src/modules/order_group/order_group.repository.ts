import { Injectable } from '@nestjs/common';
import { OrderGroup, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class orderGroupRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    dto: Prisma.OrderGroupCreateInput,
    populate?: Prisma.OrderGroupInclude<DefaultArgs>,
  ): Promise<OrderGroup> {
    console.log(dto);
    console.log(this.prisma.orderGroup);
    console.log('OK');
    return await this.prisma.orderGroup.create({
      data: dto,
      include: populate,
    });
  }
}
