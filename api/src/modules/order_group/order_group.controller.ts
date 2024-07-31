import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateOrderGroupDto, OrderGroupResponse } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { OrderGroupService } from './order_group.service';
import { pageDefault, pageSizeDefault } from 'src/shared/pagination';
import { getOrderGroupExample, getOrderGroupListExample } from './data_xample';

@Controller('order-groups')
@ApiTags('order-groups')
export class OrderGroupController {
  constructor(private orderGroupService: OrderGroupService) {}
  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: 'Create order group',
    description: 'Create order group',
  })
  @ApiBody({
    type: CreateOrderGroupDto,
    examples: {
      order_group: {
        value: {
          name: 'string',
          publicStartTime: '2024-07-21T07:00:41.005Z',
          publicEndTime: '2024-07-21T07:00:43.005Z',
          type: 'MANUAL',
          price: 250000,
          isSaveTemplate: true,
          menuItems: [
            {
              name: 'name1',
              price: 10000,
            },
            {
              name: 'name2',
              price: 1000,
            },
          ],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Sign up is successful',
    type: OrderGroupResponse,
    example: {
      message: 'Success',
      data: {
        id: 7,
      },
    },
  })
  createOrderGroup(
    @Body() body: CreateOrderGroupDto,
    @Req() request: RequestWithUser,
  ) {
    return this.orderGroupService.createOrderGroup(body, request.user);
  }

  @Get('')
  @ApiOperation({
    summary: 'Get order group',
    description: 'Get order group',
  })
  @ApiOkResponse({
    description: 'Get order group is successful',
    type: OrderGroupResponse,
    example: getOrderGroupListExample,
  })
  @UseGuards(JwtAccessTokenGuard)
  getOrderGroups(
    @Req() request: RequestWithUser,
    @Query('page') page: number = pageDefault,
    @Query('pageSize') pageSize: number = pageSizeDefault,
  ) {
    return this.orderGroupService.getOrderGroups(request.user, page, pageSize);
  }

  @Get(':id')
  @UseGuards(JwtAccessTokenGuard)
  @ApiOperation({
    summary: 'Get order group by id',
    description: 'Get order group by id',
  })
  @ApiOkResponse({
    description: 'Get order group by id is successful',
    type: OrderGroupResponse,
    example: getOrderGroupExample,
  })
  getOrderGroupsById(@Param('id') id: number, @Req() request: RequestWithUser) {
    return this.orderGroupService.getOrderGroupsById(Number(id), request.user);
  }
}
