import { Prisma, Transaction } from '@prisma/client';

export interface TransactionInterface {
  findByCondition(
    condition: Prisma.TransactionWhereInput,
  ): Promise<Transaction>;

  create(data: Prisma.TransactionCreateInput): Promise<Transaction>;

  update(
    condition: Prisma.TransactionWhereUniqueInput,
    data: Prisma.TransactionUpdateInput,
  ): Promise<Transaction>;
}
