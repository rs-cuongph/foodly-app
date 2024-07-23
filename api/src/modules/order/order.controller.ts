import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrdersService } from './order.service';

@Controller('/')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly ordersService: OrdersService) {}
}
