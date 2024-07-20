import { Injectable } from "@nestjs/common";
import { CreateOrderDto } from "./dto/create.dto";
import { User } from "@prisma/client";

@Injectable()
export class OrdersService {
  async createOrder(body: CreateOrderDto, roomId: string, currentUser: User) {

  }
}
