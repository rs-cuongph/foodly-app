import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { OrdersService } from './order.service';

@Controller('/')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/rooms/:room_id/orders')
  createOrder(
    @Body() body: CreateOrderDto,
    @Param() { room_id }: { room_id: string },
    @Req() request: RequestWithUser,
  ) {
    return this.ordersService.createOrder(body, room_id, request.user);
  }
}
