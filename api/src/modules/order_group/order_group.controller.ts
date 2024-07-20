import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateOrderGroupDto } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { OrderGroupService } from './order_group.service';

@Controller('order-groups')
@ApiTags('order-groups')
export class OrderGroupController {
  constructor(private orderGroupService: OrderGroupService) {}
  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  createOrderGroup(
    @Body() body: CreateOrderGroupDto,
    @Req() request: RequestWithUser,
  ) {
    return this.orderGroupService.createOrderGroup(body, request.user);
  }
}
