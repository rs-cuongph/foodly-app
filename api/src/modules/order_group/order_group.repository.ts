import { Injectable } from '@nestjs/common';
import { InvitedUser, OrderGroup, ShareScope } from '@prisma/client';
import { omit } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { CreateOrderGroupDto } from './dto/create.dto';
import { OrderGroupInterface } from './order_group.interface';

@Injectable()
export class orderGroupRepository implements OrderGroupInterface {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateOrderGroupDto): Promise<number> {
    return this.prisma.$transaction(async (tx) => {
      const orderGroup = await tx.orderGroup.create({
        data: omit(dto, ['menuItems', 'isSaveTemplate', 'inviteds']),
      });
      if (dto.isSaveTemplate) {
        await tx.orderGroupTemplate.create({
          data: {
            templateJson: JSON.stringify(orderGroup),
            createdById: orderGroup.createdById,
          },
        });
      }
      const newMenuItems = dto.menuItems.map((item) => {
        return {
          ...item,
          orderGroupId: orderGroup.id,
        };
      });
      await tx.menuItem.createMany({
        data: newMenuItems,
      });
      await tx.invitedUser.createMany({
        data: dto.inviteds.map((item) => {
          return {
            userId: item,
            orderGroupId: orderGroup.id,
          };
        }),
      });
      return orderGroup.id;
    });
  }

  async getLastOrderGroup(): Promise<OrderGroup> {
    const lastOrderGroup = await this.prisma.orderGroup.findMany({
      orderBy: {
        id: 'desc',
      },
      take: 1,
    });
    return lastOrderGroup[0];
  }

  async getOrderGroups(
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<OrderGroup[]> {
    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const orderGroups = await this.prisma.orderGroup.findMany({
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        invited: true,
      },
    });
    return this.filterOrderGroupHasPermission(orderGroups, userId);
  }

  async getOrderGroupsById(id: number, userId: number): Promise<OrderGroup> {
    const orderGroup = await this.prisma.orderGroup.findUnique({
      where: {
        id: id,
      },
      include: {
        invited: true,
      },
    });
    if (orderGroup.shareScope === ShareScope.PRIVATE) {
      if (
        orderGroup.createdById !== userId &&
        orderGroup.invited.every((item) => item.userId !== userId)
      ) {
        throw new Error('Unauthorized');
      }
    }
    delete orderGroup.invited;
    return orderGroup;
  }

  filterOrderGroupHasPermission(
    orderGroups: Array<OrderGroup & { invited: InvitedUser[] }>,
    userId: number,
  ): Array<OrderGroup> {
    return orderGroups.reduce(
      (
        accumulator: Array<OrderGroup & { invited: InvitedUser[] }>,
        orderGroup: OrderGroup & { invited: InvitedUser[] },
      ) => {
        if (orderGroup.shareScope === ShareScope.PRIVATE) {
          if (
            orderGroup.createdById !== userId &&
            orderGroup.invited.every((item) => item.userId !== userId)
          ) {
            return accumulator;
          }
        }
        delete orderGroup.invited;
        accumulator.push(orderGroup);
        return accumulator;
      },
      [],
    );
  }
}
