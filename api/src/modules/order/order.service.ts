import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CreateOrderDTO } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import { Order, OrderStatus, Prisma, TransactionStatus } from '@prisma/client';
import {
  ConfirmPaidAllDTO,
  ConfirmPaidDTO,
  EditOrderDTO,
  MarkPaidAllDTO,
  MarkPaidDTO,
} from './dto/edit.dto';
import * as dayjs from 'dayjs';
import { camelToSnake } from 'src/shared/convert';
import { SearchOrderDTO } from './dto/search.dto';
import { I18nService } from 'nestjs-i18n';
import { ORDER_STATUS_ENUM } from 'src/enums/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private i18n: I18nService,
  ) {}

  private async checkCanCreateOrder(user: RequestWithUser['user']) {
    const maxOrder = user.max_order;
    const ordersNotPay = await this.prismaService.client.order.findMany({
      where: {
        status: {
          in: [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
        },
      },
    });

    const currentPoint = ordersNotPay.reduce((prev, curr) => {
      let _curr = 1;
      if (curr.status === ORDER_STATUS_ENUM.PROCESSING) _curr = 0.5;
      return prev + _curr;
    }, 0);

    if (currentPoint >= maxOrder)
      throw new BadRequestException(this.i18n.t('message.max_order'));
  }

  async create(body: CreateOrderDTO, user: RequestWithUser['user']) {
    const now = dayjs().toDate();
    const group = await this.prismaService.client.group.findFirstOrThrow({
      where: {
        id: body.group_id,
        public_start_time: {
          lte: now,
        },
        public_end_time: {
          gte: now,
        },
      },
    });

    const menu = await this.prismaService.client.menuItem.findMany({
      where: {
        group_id: group.id,
        id: {
          in: body.menu.map((i) => i.id),
        },
      },
    });
    if (!menu.length)
      throw new BadRequestException(this.i18n.t('message.wrong_menu_item'));

    await this.checkCanCreateOrder(user);

    return this.prismaService.client.$transaction(async (tx) => {
      let price = 0;
      let amount = 0;

      const isSamePrice = Number(group.price) > 0;
      if (isSamePrice) {
        price = Number(menu[0].price);
        amount = body.quanlity * price;
      } else {
        amount =
          menu.reduce((prev, curr) => prev + Number(curr.price), 0) *
          body.quanlity;
      }

      const order = await tx.order.create({
        data: {
          menu,
          group_id: body.group_id,
          created_by_id: user.id,
          updated_by_id: user.id,
          status: OrderStatus.INIT,
          payment_method: body.payment_method,
          quantity: body.quanlity,
          price,
          amount,
          note: body.note,
          transactions: {
            create: [
              {
                transaction: {
                  create: {
                    metadata: {
                      payment_method: body.payment_method,
                      quanlity: body.quanlity,
                      amount,
                    },
                    status: TransactionStatus.INIT,
                  },
                },
              },
            ],
          },
        },
        include: {
          transactions: {
            include: {
              transaction: true,
            },
          },
        },
      });

      return order;
    });
  }

  checkPermission(order: Order, user: RequestWithUser['user']) {
    if (order.created_by_id !== user.id) throw new ForbiddenException();
  }

  async edit(id: string, body: EditOrderDTO, user: RequestWithUser['user']) {
    const now = dayjs().toDate();
    const order = await this.prismaService.client.order.findFirstOrThrow({
      where: {
        id,
        status: OrderStatus.INIT,
        group: {
          public_start_time: {
            lte: now,
          },
          public_end_time: {
            gte: now,
          },
        },
      },
      include: {
        group: true,
      },
    });
    this.checkPermission(order, user);
    const menu = await this.prismaService.client.menuItem.findMany({
      where: {
        group_id: order.group.id,
        id: {
          in: body.menu.map((i) => i.id),
        },
      },
    });
    if (!menu.length)
      throw new BadRequestException(this.i18n.t('message.wrong_menu_item'));
    return this.prismaService.client.$transaction(async (tx) => {
      let price = 0;
      let amount = 0;

      const isSamePrice = Number(order.group.price) > 0;
      if (isSamePrice) {
        price = Number(menu[0].price);
        amount = body.quanlity * price;
      } else {
        amount =
          menu.reduce((prev, curr) => prev + Number(curr.price), 0) *
          body.quanlity;
      }

      await tx.order.update({
        where: {
          id,
        },
        data: {
          price,
          amount,
          quantity: body.quanlity,
          menu: body.menu,
          updated_by_id: user.id,
          note: body.note,
        },
      });
    });
  }

  async show(id: string, user: RequestWithUser['user']) {
    const order = await this.prismaService.client.order.findFirstOrThrow({
      where: {
        id,
        created_by_id: user.id,
      },
      include: {
        transactions: {
          select: {
            id: true,
            transaction: true,
          },
        },
      },
    });

    return order;
  }

  async delete(id: string, user: RequestWithUser['user']) {
    const now = dayjs().toDate();
    return this.prismaService.client.$transaction(async (tx) => {
      const order = await tx.order.findFirstOrThrow({
        where: {
          id,
          status: OrderStatus.INIT,
          created_by_id: user.id,
          group: {
            public_start_time: {
              lte: now,
            },
            public_end_time: {
              gte: now,
            },
          },
        },
        include: {
          transactions: true,
        },
      });
      await tx.order.softDelete({
        id,
      });
      await tx.transaction.updateMany({
        where: {
          id: {
            in: order.transactions.map((i) => i.transaction_id),
          },
        },
        data: {
          status: TransactionStatus.CANCELED,
          reason_cancel: 'CANCEL ORDER',
        },
      });
      return order;
    });
  }

  async search(query: SearchOrderDTO, user: RequestWithUser['user']) {
    const { payment_method, sort, page, size, is_mine, statuses } = query;
    const whereClause: Prisma.OrderWhereInput = {};
    let orderByClause:
      | Prisma.OrderOrderByWithRelationInput
      | Prisma.OrderOrderByWithRelationInput[] = {
      created_at: 'desc',
    };

    if (payment_method) {
      whereClause.payment_method = payment_method;
    }

    if (statuses && statuses.length) {
      whereClause.status = {
        in: statuses,
      };
    }

    if (is_mine) {
      whereClause.created_by_id = user.id;
    }

    if (sort) {
      const [key, order] = sort.split(':');
      orderByClause = {
        [key]: order,
      };
    }

    const [orders, meta] = await this.prismaService.client.order
      .paginate({
        where: whereClause,
        orderBy: orderByClause,
      })
      .withPages({
        limit: Number(size),
        page: Number(page),
        includePageCount: true,
      });
    return {
      orders,
      meta: camelToSnake(meta),
    };
  }

  markPaid(id: string, body: MarkPaidDTO, user: RequestWithUser['user']) {
    return this.prismaService.client.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: {
          id,
          status: OrderStatus.INIT,
          created_by_id: user.id,
        },
        data: {
          status: OrderStatus.PROCESSING,
          updated_by_id: user.id,
        },
        include: {
          transactions: true,
        },
      });

      await tx.transaction.updateMany({
        where: {
          id: {
            in: order.transactions.map((i) => i.transaction_id),
          },
        },
        data: {
          status: TransactionStatus.AWAITING_CONFIRMATION,
        },
      });
      return order;
    });
  }

  confirmPaid(id: string, body: ConfirmPaidDTO, user: RequestWithUser['user']) {
    return this.prismaService.client.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: {
          id,
          status: {
            in: [OrderStatus.INIT, OrderStatus.PROCESSING],
          },
          group: {
            created_by_id: user.id,
          },
        },
        data: {
          status: OrderStatus.COMPLETED,
          updated_by_id: user.id,
        },
        include: {
          transactions: true,
        },
      });
      await tx.transaction.updateMany({
        where: {
          id: {
            in: order.transactions.map((i) => i.transaction_id),
          },
        },
        data: {
          status: TransactionStatus.COMPLETED,
        },
      });

      return order;
    });
  }

  async markPaidAll(body: MarkPaidAllDTO, user: RequestWithUser['user']) {
    for await (const id of body.ids) {
      await this.markPaid(id, {}, user);
    }
    return true;
  }

  confirmPaidAll(body: ConfirmPaidAllDTO, user: RequestWithUser['user']) {
    return this.prismaService.client.$transaction(async (tx) => {
      for await (const id of body.ids) {
        const order = await tx.order.update({
          where: {
            id,
            status: {
              in: [OrderStatus.INIT, OrderStatus.PROCESSING],
            },
            group: {
              created_by_id: user.id,
            },
          },
          data: {
            status: OrderStatus.COMPLETED,
            updated_by_id: user.id,
          },
          include: {
            transactions: true,
          },
        });
        await tx.transaction.updateMany({
          where: {
            id: {
              in: order.transactions.map((i) => i.transaction_id),
            },
          },
          data: {
            status: TransactionStatus.COMPLETED,
          },
        });
      }
    });
  }
}
