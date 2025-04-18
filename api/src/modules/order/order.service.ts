import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CreateOrderDTO } from './dto/create.dto';
import { RequestWithUser } from 'src/types/requests.type';
import {
  Group,
  GroupStatus,
  Order,
  OrderStatus,
  Prisma,
  ShareScope,
  TransactionStatus,
  TransactionType,
} from '@prisma/client';
import {
  CancelOrderDTO,
  ConfirmPaidAllDTO,
  ConfirmPaidDTO,
  EditOrderDTO,
  MarkPaidAllDTO,
  MarkPaidDTO,
} from './dto/edit.dto';
import * as dayjs from 'dayjs';
import { camelToSnake } from 'src/utils/convert';
import { SearchOrderDTO } from './dto/search.dto';
import { I18nService } from 'nestjs-i18n';
import { ORDER_STATUS_ENUM } from '@enums/status.enum';

@Injectable()
export class OrderService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private i18n: I18nService,
  ) {}

  private async checkInviteCode(
    group: Group,
    inviteCode: string,
    currentUser: RequestWithUser['user'],
  ) {
    if (group.created_by_id === currentUser.id) return group;

    if (
      group.share_scope == ShareScope.PRIVATE &&
      group.invite_code !== inviteCode
    ) {
      throw new BadRequestException(
        this.i18n.t('message.invite_code_incorrect'),
      );
    }

    return group;
  }

  private async checkGroupIsLocked(id: string) {
    const group = await this.prismaService.client.group.findFirst({
      where: {
        id,
      },
    });

    if (group.status == GroupStatus.LOCKED) {
      throw new ForbiddenException(this.i18n.t('message.group_locked'));
    }

    return group;
  }

  private async checkCanCreateOrder(user: RequestWithUser['user']) {
    const maxOrder = user.max_order;
    const ordersNotPay = await this.prismaService.client.order.findMany({
      where: {
        created_by_id: user.id,
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

  private generateUniqueCode() {
    const timestamp = dayjs().format('YYMMDDHHmmss'); // 12 characters
    const randomChars = Math.random().toString(36).substring(2, 10); // 8 characters
    return `${timestamp}${randomChars}`.toLowerCase(); // total 20 characters
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
        status: GroupStatus.INIT,
        deleted_at: null,
      },
    });

    await this.checkInviteCode(group, body.invite_code, user);
    await this.checkGroupIsLocked(group.id);

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

    const isGroupOwner = group.created_by_id === user.id;
    if (!isGroupOwner) await this.checkCanCreateOrder(user);

    return this.prismaService.client.$transaction(async (tx) => {
      let price = 0;
      let amount = 0;

      const isSamePrice = Number(group.price) > 0;
      if (isSamePrice) {
        price = Number(group.price);
        amount = body.quantity * price;
      } else {
        amount =
          menu.reduce((prev, curr) => prev + Number(curr.price), 0) *
          body.quantity;
      }

      const newTransaction = await tx.transaction.create({
        data: {
          organization_id: user.organization_id,
          status: TransactionStatus.INIT,
          type: TransactionType.SINGLE_ORDER,
          total_amount: amount,
          metadata: {
            payment_setting: body.payment_setting[0],
            quantity: body.quantity,
            amount,
          },
          unique_code: this.generateUniqueCode(),
        },
      });

      const newOrder = await tx.order.create({
        data: {
          organization_id: user.organization_id,
          menu,
          group_id: body.group_id,
          created_by_id: user.id,
          updated_by_id: user.id,
          status: OrderStatus.INIT,
          payment_method: body.payment_setting[0].payment_method,
          quantity: body.quantity,
          price,
          amount,
          note: body.note,
          transaction_id: newTransaction.id,
        },
      });

      return {
        ...newOrder,
        transaction: newTransaction,
      };
    });
  }

  async edit(id: string, body: EditOrderDTO, user: RequestWithUser['user']) {
    const now = dayjs().toDate();
    const order = await this.prismaService.client.order.findFirst({
      where: {
        id,
        status: {
          in: [OrderStatus.INIT, OrderStatus.PROCESSING],
        },
        group: {
          public_start_time: {
            lte: now,
          },
          public_end_time: {
            gte: now,
          },
          status: GroupStatus.INIT,
          deleted_at: null,
        },
        deleted_at: null,
      },
      include: {
        group: true,
      },
    });

    if (!order)
      throw new BadRequestException(this.i18n.t('message.order_not_found'));

    await this.checkInviteCode(order.group, body.invite_code, user);
    await this.checkGroupIsLocked(order.group.id);

    if (order.created_by_id !== user.id) throw new ForbiddenException();

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

    const transaction = await this.prismaService.client.transaction.findFirst({
      where: {
        id: order.transaction_id,
        status: {
          in: [TransactionStatus.INIT, TransactionStatus.PROCESSING],
        },
      },
    });

    if (!transaction)
      throw new BadRequestException(
        this.i18n.t('message.transaction_not_found'),
      );

    return this.prismaService.client.$transaction(async (tx) => {
      let price = 0;
      let amount = 0;

      const isSamePrice = Number(order.group.price) > 0;

      if (isSamePrice) {
        price = Number(order.group.price);
        amount = body.quantity * price;
      } else {
        amount =
          menu.reduce((prev, curr) => prev + Number(curr.price), 0) *
          body.quantity;
      }

      await tx.order.update({
        where: {
          id,
        },
        data: {
          price,
          amount,
          quantity: body.quantity,
          menu: body.menu,
          updated_by_id: user.id,
          note: body.note,
        },
      });

      await tx.transaction.update({
        where: {
          id: order.transaction_id,
          status: TransactionStatus.INIT,
        },
        data: {
          metadata: {
            payment_setting: transaction.metadata['payment_setting'],
            quantity: body.quantity,
            amount,
          },
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
    });

    const transaction = await this.prismaService.client.transaction.findFirst({
      where: {
        id: order.transaction_id,
      },
    });

    return {
      ...order,
      transaction,
    };
  }

  async cancel(
    id: string,
    body: CancelOrderDTO,
    user: RequestWithUser['user'],
  ) {
    const now = dayjs().toDate();
    return this.prismaService.client.$transaction(async (tx) => {
      const whereClause: Prisma.OrderWhereInput = {
        id,
        status: {
          in: [OrderStatus.INIT, OrderStatus.PROCESSING],
        },
        group: {
          public_start_time: {
            lte: now,
          },
          public_end_time: {
            gte: now,
          },
          status: GroupStatus.INIT,
          deleted_at: null,
        },
        transaction: {
          status: {
            in: [
              TransactionStatus.INIT,
              TransactionStatus.PROCESSING,
              TransactionStatus.AWAITING_CONFIRMATION,
            ],
          },
        },
        deleted_at: null,
      };

      const order = await tx.order.findFirst({
        where: whereClause,
        include: {
          group: true,
          transaction: true,
        },
      });

      if (!order)
        throw new BadRequestException(this.i18n.t('message.order_not_found'));

      // is group owner
      if (order.group.created_by_id === user.id) {
        // allow cancel
      } else if (order.created_by_id === user.id) {
        // is order creator
        if (order.created_at < dayjs().subtract(10, 'minute').toDate()) {
          throw new BadRequestException(
            this.i18n.t('message.order_over_10_minutes'),
          );
        }

        if (
          order.transaction.status === TransactionStatus.AWAITING_CONFIRMATION
        ) {
          throw new BadRequestException(this.i18n.t('message.order_has_paid'));
        }
      }

      await tx.order.update({
        where: {
          id,
        },
        data: {
          deleted_at: new Date(),
          status: OrderStatus.CANCELED,
        },
      });

      if (order.transaction_id) {
        await tx.transaction.updateMany({
          where: {
            id: order.transaction_id,
          },
          data: {
            status: TransactionStatus.CANCELED,
            reason_cancel: body.reason,
          },
        });
      }
      return order;
    });
  }

  async search(query: SearchOrderDTO, user: RequestWithUser['user']) {
    const {
      payment_method,
      sort,
      page,
      size,
      is_mine,
      is_mine_group,
      statuses,
      with_group,
      with_created_by,
      group_id,
      keyword,
    } = query;
    const whereClause: Prisma.OrderWhereInput = {};
    const include = {
      group:
        with_group && with_group == 1
          ? {
              select: {
                id: true,
                name: true,
                code: true,
                share_scope: true,
                type: true,
                price: true,
                status: true,
                created_by: {
                  select: {
                    id: true,
                    email: true,
                    display_name: true,
                  },
                },
              },
            }
          : false,
      transaction: {
        select: {
          unique_code: true,
        },
      },
      created_by:
        with_created_by && with_created_by == 1
          ? {
              select: {
                id: true,
                email: true,
                display_name: true,
              },
            }
          : false,
    };

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

    if (group_id) {
      whereClause.group_id = group_id;
    }

    if (is_mine && is_mine == 1) {
      if (!user) throw new UnauthorizedException();
      whereClause.created_by_id = user.id;
    }

    if (is_mine_group && is_mine_group == 1) {
      if (!user) throw new UnauthorizedException();
      whereClause.group = {
        created_by_id: user.id,
      };
    }

    if (keyword) {
      whereClause.OR = [
        {
          note: {
            contains: keyword,
            mode: 'insensitive',
          },
        },
        {
          group: {
            OR: [
              {
                name: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
              {
                code: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
              // {
              //   created_by: {
              //     OR: [
              //       {
              //         email: {
              //           contains: keyword,
              //           mode: 'insensitive',
              //         },
              //       },
              //       {
              //         display_name: {
              //           contains: keyword,
              //           mode: 'insensitive',
              //         },
              //       },
              //     ],
              //   },
              // },
            ],
          },
        },
        {
          created_by: {
            OR: [
              {
                email: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
              {
                display_name: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            ],
          },
        },
      ];
    }
    if (sort) {
      const [key, order] = sort.split(':');
      orderByClause = {
        [key]: order,
      };
    }

    const allOrder = await this.prismaService.client.order.findMany({
      where: whereClause,
      select: {
        quantity: true,
        amount: true,
      },
    });

    const total_quantity = allOrder.reduce(
      (prev, curr) => prev + curr.quantity,
      0,
    );

    const total_amount = allOrder.reduce(
      (prev, curr) => prev + Number(curr.amount),
      0,
    );

    const [orders, meta] = await this.prismaService.client.order
      .paginate({
        where: whereClause,
        orderBy: orderByClause,
        include,
      })
      .withPages({
        limit: Number(size),
        page: Number(page),
        includePageCount: true,
      });

    return {
      orders,
      meta: camelToSnake(meta),
      total_quantity,
      total_amount,
    };
  }

  /**
   * Marks an order as paid (only accessible by the order creator)
   * @param id The order ID to mark as paid
   * @param body The mark paid payload
   * @param user The authenticated user making the request
   * @returns The updated order
   */
  markPaid(id: string, body: MarkPaidDTO, user: RequestWithUser['user']) {
    return this.prismaService.client.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: {
          id,
          status: {
            in: [OrderStatus.INIT, OrderStatus.COMPLETED],
          },
          created_by_id: user.id,
        },
      });

      if (!order)
        throw new BadRequestException(this.i18n.t('message.order_not_found'));

      if (order.status === OrderStatus.COMPLETED) {
        return {
          message: this.i18n.t('message.order_already_paid'),
        };
      }

      await tx.order.update({
        where: {
          id,
        },
        data: {
          status: OrderStatus.PROCESSING,
          updated_by_id: user.id,
        },
      });

      await tx.transaction.updateMany({
        where: {
          id: order.transaction_id,
        },
        data: {
          status: TransactionStatus.AWAITING_CONFIRMATION,
        },
      });

      return order;
    });
  }

  /**
   * Confirms an order as paid (only accessible by the group creator)
   * @param id The order ID to confirm
   * @param body The confirmation payload
   * @param user The authenticated user making the request
   * @returns The updated order
   */
  async confirmPaid(
    id: string,
    body: ConfirmPaidDTO,
    user: RequestWithUser['user'],
  ) {
    const findOrder = await this.prismaService.client.order.findFirst({
      where: {
        id,
        status: {
          in: [OrderStatus.INIT, OrderStatus.PROCESSING],
        },
        group: {
          created_by_id: user.id,
        },
      },
    });

    if (!findOrder)
      throw new BadRequestException(this.i18n.t('message.order_not_found'));

    return this.prismaService.client.$transaction(async (tx) => {
      const order = await tx.order.update({
        where: {
          id: findOrder.id,
        },
        data: {
          status: OrderStatus.COMPLETED,
          updated_by_id: user.id,
        },
      });
      await tx.transaction.updateMany({
        where: {
          id: findOrder.transaction_id,
        },
        data: {
          status: TransactionStatus.COMPLETED,
        },
      });

      return order;
    });
  }

  /**
   * Marks multiple orders as paid in bulk (only accessible by the order owner)
   * @param body Contains array of order IDs to mark as paid
   * @param user The authenticated user making the request
   * @returns True if successful
   */
  async markPaidAll(body: MarkPaidAllDTO, user: RequestWithUser['user']) {
    const { include_ids, exclude_ids } = body;
    let orders: Order[] = [];

    // if is mark all
    if (!include_ids.length && !exclude_ids.length) {
      orders = await this.prismaService.client.order.findMany({
        where: {
          status: {
            in: [
              OrderStatus.INIT,
              OrderStatus.PROCESSING,
              OrderStatus.COMPLETED,
            ],
          },
          created_by_id: user.id,
        },
      });
    }

    if (!include_ids.length && exclude_ids.length) {
      orders = await this.prismaService.client.order.findMany({
        where: {
          status: {
            in: [
              OrderStatus.INIT,
              OrderStatus.PROCESSING,
              OrderStatus.COMPLETED,
            ],
          },
          created_by_id: user.id,
          id: {
            notIn: exclude_ids,
          },
        },
      });
    }

    if (
      (include_ids.length && !exclude_ids.length) ||
      (include_ids.length && exclude_ids.length)
    ) {
      orders = await this.prismaService.client.order.findMany({
        where: {
          status: {
            in: [
              OrderStatus.INIT,
              OrderStatus.PROCESSING,
              OrderStatus.COMPLETED,
            ],
          },
          id: {
            in: include_ids,
          },
        },
      });
    }

    const ordersNotPay = orders.filter(
      (i) =>
        i.status === OrderStatus.INIT || i.status === OrderStatus.PROCESSING,
    );

    if (!ordersNotPay.length) {
      return {
        success: true,
        unique_code: null,
      };
    }

    try {
      return await this.prismaService.client.$transaction(async (tx) => {
        const newTransaction = await tx.transaction.create({
          data: {
            organization_id: user.organization_id,
            status: TransactionStatus.AWAITING_CONFIRMATION,
            type: TransactionType.SETTLEMENT,
            total_amount: ordersNotPay.reduce(
              (prev, curr) => prev + Number(curr.amount),
              0,
            ),
            unique_code: this.generateUniqueCode(),
            metadata: {
              orders: ordersNotPay.map((i) => ({
                id: i.id,
                quantity: i.quantity,
                amount: i.amount,
                menu: i.menu,
                price: i.price,
                payment_method: i.payment_method,
              })),
              quantity: ordersNotPay.reduce(
                (prev, curr) => prev + Number(curr.quantity),
                0,
              ),
              amount: ordersNotPay.reduce(
                (prev, curr) => prev + Number(curr.amount),
                0,
              ),
            },
          },
        });

        await tx.orderOnTransaction.createMany({
          data: ordersNotPay.map((i) => ({
            order_id: i.id,
            transaction_id: newTransaction.id,
            amount: i.amount,
          })),
        });

        // remove old transaction
        await tx.transaction.deleteMany({
          where: {
            id: {
              in: ordersNotPay.map((i) => i.transaction_id),
            },
          },
        });

        await tx.order.updateMany({
          where: {
            id: {
              in: ordersNotPay.map((i) => i.id),
            },
            status: {
              in: [OrderStatus.INIT, OrderStatus.PROCESSING],
            },
          },
          data: {
            status: OrderStatus.PROCESSING,
            transaction_id: newTransaction.id,
            updated_by_id: user.id,
          },
        });

        return {
          success: true,
          unique_code: newTransaction.unique_code,
        };
      });
    } catch (error) {
      throw new BadRequestException(
        this.i18n.t('message.mark_paid_all_failed'),
      );
    }
  }

  /**
   * Confirms multiple orders as paid in bulk (only accessible by the group creator)
   * @param body Contains array of order IDs to confirm
   * @param user The authenticated user making the request
   * @returns The transaction result
   */
  async confirmPaidAll(body: ConfirmPaidAllDTO, user: RequestWithUser['user']) {
    const { include_ids, exclude_ids } = body;
    let orders: Order[] = [];

    // if is mark all
    if (!include_ids.length && !exclude_ids.length) {
      orders = await this.prismaService.client.order.findMany({
        where: {
          status: {
            in: [OrderStatus.INIT, OrderStatus.PROCESSING],
          },
          group: {
            created_by_id: user.id,
          },
        },
      });
    }

    if (!include_ids.length && exclude_ids.length) {
      orders = await this.prismaService.client.order.findMany({
        where: {
          status: {
            in: [OrderStatus.INIT, OrderStatus.PROCESSING],
          },
          group: {
            created_by_id: user.id,
          },
          id: {
            notIn: exclude_ids,
          },
        },
      });
    }

    if (
      (include_ids.length && !exclude_ids.length) ||
      (include_ids.length && exclude_ids.length)
    ) {
      orders = await this.prismaService.client.order.findMany({
        where: {
          status: {
            in: [OrderStatus.INIT, OrderStatus.PROCESSING],
          },
          group: {
            created_by_id: user.id,
          },
          id: {
            in: include_ids,
          },
        },
      });
    }

    return this.prismaService.client.$transaction(async (tx) => {
      await tx.order.updateMany({
        where: {
          id: {
            in: orders.map((i) => i.id),
          },
        },
        data: {
          status: OrderStatus.COMPLETED,
          updated_by_id: user.id,
        },
      });

      try {
        await tx.transaction.updateMany({
          where: {
            id: {
              in: orders
                .filter((i) => i.transaction_id)
                .map((i) => i.transaction_id),
            },
          },
          data: {
            status: TransactionStatus.COMPLETED,
          },
        });
      } catch (error) {
        console.log(error);
      }
      return {
        success: true,
      };
    });
  }
}
