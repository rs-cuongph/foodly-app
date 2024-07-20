import { Injectable } from "@nestjs/common";
import { OrderGroup } from "@prisma/client";
import { omit } from "lodash";
import { PrismaService } from "nestjs-prisma";
import { CreateOrderGroupDto } from "./dto/create.dto";

@Injectable()
export class orderGroupRepository {
  constructor(private prisma: PrismaService) { }

  async create(
    dto: CreateOrderGroupDto,
  ): Promise<number> {
    return this.prisma.$transaction(async (tx) => {
      const orderGroup = await tx.orderGroup.create({
        data: omit(dto, ["menuItems", "isSaveTemplate"]),
      })
      if (dto.isSaveTemplate) {
        await tx.orderGroupTemplate.create({
          data: {
            templateJson: JSON.stringify(orderGroup),
            createdById: orderGroup.createdById
          }
        })
      }
      const newMenuItems = dto.menuItems.map((item) => {
        return {
          ...item,
          orderGroupId: orderGroup.id
        }
      })
      await tx.menuItem.createMany({
        data: newMenuItems,
      })

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
}