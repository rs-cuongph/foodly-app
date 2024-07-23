import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateOrderGroupDto } from './dto/create.dto';
import { OrderGroupInterface } from './order_group.interface';
import * as winston from 'winston';
import * as _ from 'lodash';

@Injectable()
export class OrderGroupService {
  private readonly winstonLogger: winston.Logger;
  constructor(
    @Inject('OrderGroupInterface')
    private readonly orderGroupRepository: OrderGroupInterface,
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
}
