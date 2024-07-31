import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { OrderGroup, User } from '@prisma/client';
import { CreateOrderGroupDto } from './dto/create.dto';
import { OrderGroupInterface } from './order_group.interface';
import * as winston from 'winston';
import * as _ from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { paginate } from 'src/shared/pagination';

@Injectable()
export class OrderGroupService {
  private readonly winstonLogger: winston.Logger;
  constructor(
    @Inject('OrderGroupInterface')
    private readonly orderGroupRepository: OrderGroupInterface,
    private prisma: PrismaService,
  ) {
    this.winstonLogger = winston.createLogger({
      transports: [new winston.transports.Console()],
    });
  }

  async createOrderGroup(body: CreateOrderGroupDto, currentUser: User) {
    try {
      let nextID = '0000000001';
      const lastRoom = await this.orderGroupRepository.getLastOrderGroup();
      if (lastRoom && lastRoom.code) {
        nextID = _.padStart((Number(lastRoom.code) + 1).toString(), 10, '0');
      }
      const id = await this.orderGroupRepository.create({
        ...body,
        code: nextID,
        createdBy: {
          connect: {
            id: currentUser.id,
          },
        },
      });
      return {
        message: 'Success',
        data: {
          id: id,
        },
      };
    } catch (error) {
      this.winstonLogger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getOrderGroups(currentUser: User, page: number, pageSize: number) {
    try {
      const totalCount = await this.prisma.orderGroup.count();
      const orderGroups = await this.orderGroupRepository.getOrderGroups(
        currentUser.id,
        page,
        pageSize,
      );
      return paginate<OrderGroup>(page, pageSize, totalCount, orderGroups);
    } catch (error) {
      this.winstonLogger.error(error);
      throw new BadRequestException(error);
    }
  }

  async getOrderGroupsById(id: number, currentUser: User) {
    try {
      return await this.orderGroupRepository.getOrderGroupsById(
        id,
        currentUser.id,
      );
    } catch (error) {
      this.winstonLogger.error(error);
      throw new BadRequestException(error);
    }
  }
}
