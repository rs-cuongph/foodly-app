import { OrderGroup, Prisma } from '@prisma/client';

export interface OrderGroupInterface {
  create(dto: Prisma.OrderGroupCreateInput): Promise<number>;

  getLastOrderGroup(): Promise<OrderGroup>;

  getOrderGroups(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<OrderGroup[]>;

  getOrderGroupsById(id: number, userId: number): Promise<OrderGroup>;
}
