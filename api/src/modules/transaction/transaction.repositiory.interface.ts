import { Prisma, Transaction } from '@prisma/client';

export interface TransactionInterface {
  findByCondition(
    condition: Prisma.TransactionWhereInput,
  ): Promise<Transaction>;

  create(
    data: Prisma.TransactionCreateInput,
    callback?: (trans: Transaction) => Promise<{
      message: string;
      data: any;
    }>,
  ): Promise<{
    message: string;
    data: any;
  }>;

  update(
    condition: Prisma.TransactionWhereUniqueInput,
    data: Prisma.TransactionUpdateInput,
  ): Promise<Transaction>;
}
