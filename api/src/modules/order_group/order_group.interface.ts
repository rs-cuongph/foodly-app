import { OrderGroup, Prisma } from '@prisma/client';

export interface OrderGroupInterface {
  create(dto: Prisma.OrderGroupCreateInput): Promise<number>;

  getLastOrderGroup(): Promise<OrderGroup>;
}
