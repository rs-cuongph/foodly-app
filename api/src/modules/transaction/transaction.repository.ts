import { Injectable } from '@nestjs/common';
import { Prisma, Transaction } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TransactionRepository {
  constructor(private prisma: PrismaService) {}

  public async create(
    data: Prisma.TransactionCreateInput,
    callback?: (trans: Transaction) => Promise<{
      message: string;
      data: any;
    }>,
  ): Promise<{
    message: string;
    data: any;
  }> {
    const result = await this.prisma.$transaction(async (tx) => {
      const newTran = await tx.transaction.create({
        data,
      });
      const resultCallback = await callback?.(newTran);
      const metadata = JSON.parse(JSON.stringify(newTran.metadata));
      console.log('metadata', metadata);
      console.log('resultCallback', resultCallback);
      await tx.transaction.update({
        where: {
          id: newTran.id,
        },
        data: {
          paymentLinkId: resultCallback.data.data.paymentLinkId,
          metadata: {
            ...metadata,
            payos: resultCallback,
          },
        },
      });
      return resultCallback;
    });
    return result;
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
