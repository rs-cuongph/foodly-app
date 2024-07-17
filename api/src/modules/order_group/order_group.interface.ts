import { OrderGroup, Prisma, User } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

export interface OrderGroupInterface {
  create(
    dto: Prisma.OrderGroupCreateInput,
    populate?: Prisma.OrderGroupInclude<DefaultArgs>,
  ): Promise<OrderGroup>;
}
