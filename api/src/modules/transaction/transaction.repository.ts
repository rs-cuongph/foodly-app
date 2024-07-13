import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  public async create(
    data: Prisma.TransactionCreateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }

  public async findByCondition(
    condition: Prisma.TransactionWhereInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.findFirst({
      where: condition,
    });
  }

  public async update(
    condition: Prisma.TransactionWhereUniqueInput,
    data: Prisma.TransactionUpdateInput,
  ): Promise<Transaction> {
    return this.prisma.transaction.update({ where: condition, data });
  }
}
