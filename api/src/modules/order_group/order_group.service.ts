import { Inject, Injectable } from "@nestjs/common";
import { Prisma, User } from "@prisma/client";
import { orderGroupRepository } from "./order_group.repository";
import { CreateOrderGroupDto } from "./dto/create.dto";
import { UserService } from "@modules/user/user.service";
import { OrderGroupInterface } from "./order_group.interface";
import { transformDataByTemplate } from "src/shared/convert";

@Injectable()
export class OrderGroupService {
  constructor(
    @Inject('OrderGroupInterface')
    private readonly orderGroupRepository: OrderGroupInterface,
    private userService: UserService) {

  }

  async createOrderGroup(body: CreateOrderGroupDto, currentUser: User) {
    // let nextID = '0000000001';
    // let userIds = [];
    // const lastRoom = await this.orderGroupRepository.getLastRoom();

    // if (lastRoom && lastRoom.room_id) {
    //   nextID = _.padStart((Number(lastRoom.room_id) + 1).toString(), 10, '0');
    // }
    // if (body.invited_people?.length > 0) {
    //   const users = await this.userService.getUsersWithId(
    //     body.invited_people,
    //   );
    //   userIds = users?.map((user) => user.id);
    // }
    const newData = transformDataByTemplate({
      ...body,
      createdById: currentUser.id,
    }, Prisma.OrderGroupScalarFieldEnum)
    return this.orderGroupRepository.create(
      {
        ...newData
      }
    );
  }
}