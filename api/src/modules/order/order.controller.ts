import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { CreateOrderDTO } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import {
  CancelOrderDTO,
  ConfirmPaidAllDTO,
  ConfirmPaidDTO,
  EditOrderDTO,
  MarkPaidAllDTO,
  MarkPaidDTO,
} from './dto/edit.dto';
import { SearchOrderDTO } from './dto/search.dto';
import { Public } from '@decorators/auth.decorator';

@Controller('/orders')
@ApiTags('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  create(@Body() body: CreateOrderDTO, @Req() req: RequestWithUser) {
    return this.orderService.create(body, req.user);
  }

  @Put('/:id')
  edit(
    @Param('id') id: string,
    @Body() body: EditOrderDTO,
    @Req() req: RequestWithUser,
  ) {
    return this.orderService.edit(id, body, req.user);
  }

  @Get('/:id')
  show(@Param('id') id: string, @Req() request: RequestWithUser) {
    return this.orderService.show(id, request.user);
  }

  @Put('/:id/cancel')
  delete(
    @Param('id') id: string,
    @Body() body: CancelOrderDTO,
    @Req() request: RequestWithUser,
  ) {
    return this.orderService.cancel(id, body, request.user);
  }

  @Public()
  @Get('/')
  search(@Query() query: SearchOrderDTO, @Req() request: RequestWithUser) {
    return this.orderService.search(query, request.user);
  }

  @Patch('mark-paid-all')
  markPaidAll(@Body() body: MarkPaidAllDTO, @Req() request: RequestWithUser) {
    return this.orderService.markPaidAll(body, request.user);
  }

  @Patch('confirm-paid-all')
  confirmPaidAll(
    @Body() body: ConfirmPaidAllDTO,
    @Req() request: RequestWithUser,
  ) {
    return this.orderService.confirmPaidAll(body, request.user);
  }

  @Patch('/:id/mark-paid')
  markPaid(
    @Param('id') id: string,
    @Body() body: MarkPaidDTO,
    @Req() request: RequestWithUser,
  ) {
    return this.orderService.markPaid(id, body, request.user);
  }

  @Patch('/:id/confirm-paid')
  confirmPaid(
    @Param('id') id: string,
    @Body() body: ConfirmPaidDTO,
    @Req() request: RequestWithUser,
  ) {
    return this.orderService.confirmPaid(id, body, request.user);
  }
}
