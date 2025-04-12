/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGroupDTO } from './dto/create.dto';
import * as _ from 'lodash';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';
import * as dayjs from 'dayjs';
import { RequestWithUser } from 'src/types/requests.type';
import { EditGroupDTO } from './dto/edit.dto';
import { SearchGroupDTO } from './dto/search.dto';
import { Group, GroupStatus, Prisma, ShareScope } from '@prisma/client';
import { camelToSnake } from 'src/utils/convert';
import { QueryShowGroupDTO } from './dto/show.dto';
import { I18nService } from 'nestjs-i18n';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class GroupService {
  private logger = new Logger(GroupService.name);
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly i18n: I18nService,
  ) {}

  private checkInviteCode(group: Group, inviteCode: string) {
    if (
      group.share_scope == ShareScope.PRIVATE &&
      group.invite_code !== inviteCode
    ) {
      throw new BadRequestException(
        this.i18n.t('message.invite_code_incorrect'),
      );
    }
  }

  private generateInviteCode() {
    return _.times(20, () =>
      _.sample('abcdefghijklmnopqrstuvwxyz0123456789'),
    ).join('');
  }

  async checkGroupIsLocked(id: string, notThrowError = false) {
    const group = await this.prismaService.client.group.findFirst({
      where: {
        id,
      },
    });

    if (!group) {
      throw new NotFoundException(this.i18n.t('message.group_not_found'));
    }

    if (group.status == GroupStatus.LOCKED) {
      if (notThrowError) return null;
      throw new ForbiddenException(this.i18n.t('message.group_locked'));
    }

    return group;
  }

  async create(body: CreateGroupDTO, user: RequestWithUser['user']) {
    try {
      let nextID = '0000000001';
      const lastGroup = await this.prismaService.client.group.findFirst({
        orderBy: {
          code: 'desc',
        },
      });
      if (lastGroup && lastGroup.code) {
        nextID = _.padStart((Number(lastGroup.code) + 1).toString(), 10, '0');
      }

      let inviteCode = null;
      if (body.share_scope === ShareScope.PRIVATE) {
        inviteCode = this.generateInviteCode();
      }

      body.public_start_time = body.public_start_time || dayjs().toDate();

      return this.prismaService.client.$transaction(async (tx) => {
        const group = await tx.group.create({
          data: {
            organization_id: user.organization_id,
            name: body.name,
            code: nextID,
            public_start_time: body.public_start_time,
            public_end_time:
              body.public_end_time ||
              dayjs(body.public_start_time).add(1, 'hour').toDate(),
            price: body.price,
            share_scope: body.share_scope,
            created_by_id: user.id,
            type: body.type,
            invite_code: inviteCode,
          },
        });
        await tx.menuItem.createMany({
          data: body.menu_items.map((item) => {
            return {
              group_id: group.id,
              name: item.name,
              price: item.price,
            };
          }),
        });

        if (body.is_save_template) {
          await tx.groupTemplate.create({
            data: {
              created_by_id: user.id,
              templateJson: body,
            },
          });
        }

        return group;
      });
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async edit(id: string, body: EditGroupDTO, user: RequestWithUser['user']) {
    await this.checkGroupIsLocked(id);
    return this.prismaService.client.$transaction(async (tx) => {
      let inviteCode = null;

      const group = await tx.group.findFirst({
        where: {
          id,
          created_by_id: user.id,
        },
      });

      if (
        group.share_scope === ShareScope.PUBLIC &&
        !group.invite_code &&
        body.share_scope === ShareScope.PRIVATE
      ) {
        inviteCode = this.generateInviteCode();
      }

      await tx.group.update({
        where: {
          id,
          created_by_id: user.id,
        },
        data: {
          name: body.name,
          public_start_time: body.public_start_time,
          public_end_time:
            body.public_end_time ||
            dayjs(body.public_start_time).add(1, 'hour').toDate(),
          price: body.price ?? 0,
          share_scope: body.share_scope,
          type: body.type,
          invite_code: inviteCode,
        },
      });

      for (const item of body.menu_items) {
        if (item?.id && item?._destroy) {
          await tx.menuItem.delete({
            where: {
              id: item.id,
            },
          });
        } else {
          const dataUpsert = {
            group_id: group.id,
            name: item.name,
            price: item.price,
          };

          await tx.menuItem.upsert({
            where: {
              id: item?.id ?? '',
              group_id: group.id,
            },
            create: dataUpsert,
            update: dataUpsert,
          });
        }
      }

      return group;
    });
  }

  async delete(id: string, user: RequestWithUser['user']) {
    await this.checkGroupIsLocked(id);
    return this.prismaService.client.group.softDelete({
      id,
      created_by_id: user.id,
    });
  }

  async show(
    id: string,
    query: QueryShowGroupDTO,
    user: RequestWithUser['user'] | null,
  ) {
    const findGroup = await this.prismaService.client.group.findFirstOrThrow({
      where: {
        id,
      },
      include: {
        orders: query?.with_orders == 1,
        menu_items: true,
        created_by: {
          select: {
            id: true,
            display_name: true,
            payment_setting: true,
          },
        },
      },
    });

    const isSamePrice = Number(findGroup.price) > 0;
    findGroup['is_same_price'] = isSamePrice;

    // Get price range of menu items
    const priceMenuItems = findGroup.menu_items.map((item) =>
      Number(item.price),
    );

    findGroup['price_range'] = isSamePrice
      ? [Math.min(...priceMenuItems), Math.max(...priceMenuItems)]
      : [];

    if (user && findGroup.created_by_id === user.id) {
      return findGroup;
    }

    if (findGroup.status == GroupStatus.INIT) {
      this.checkInviteCode(findGroup, query.invite_code);
    }

    return findGroup;
  }

  async search(query: SearchGroupDTO, user: RequestWithUser['user'] | null) {
    const {
      keyword,
      sort,
      page,
      size,
      is_online,
      is_mine,
      share_scope,
      status,
    } = query;
    const whereClause: Prisma.GroupWhereInput = {
      // share_scope: {
      //   in: [ShareScope.PUBLIC, ShareScope.PRIVATE],
      // },
    };

    whereClause.OR = [];
    whereClause.AND = [];

    let orderByClause:
      | Prisma.GroupOrderByWithRelationInput
      | Prisma.GroupOrderByWithRelationInput[] = {
      created_at: 'desc',
    };

    if (keyword) {
      whereClause.OR = [
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
      ];
    }

    if (user) {
      whereClause.organization_id = user.organization_id;
    }

    if (is_mine && is_mine == 1 && user) {
      whereClause.AND = [
        ...whereClause.AND,
        {
          created_by_id: user.id,
        },
      ];
    }

    if (is_online) {
      const splitIsOnline = is_online.toString().split(',');
      if (splitIsOnline.includes('1') && splitIsOnline.includes('0')) {
        //
      } else if (splitIsOnline.includes('1')) {
        whereClause.AND = [
          ...whereClause.AND,
          {
            public_start_time: {
              lte: dayjs().toDate(),
            },
            public_end_time: {
              gte: dayjs().toDate(),
            },
            status: GroupStatus.INIT,
          },
        ];
      } else if (splitIsOnline.includes('0')) {
        whereClause.AND = [
          ...whereClause.AND,
          {
            OR: [
              {
                status: GroupStatus.LOCKED,
              },
              {
                public_start_time: {
                  gt: dayjs().toDate(),
                },
              },
              {
                public_end_time: {
                  lt: dayjs().toDate(),
                },
              },
            ],
          },
        ];
      }
    }

    if (whereClause.AND.length === 0) {
      delete whereClause.AND;
    }

    if (whereClause.OR.length === 0) {
      delete whereClause.OR;
    }

    if (share_scope && share_scope.length > 0) {
      whereClause.share_scope = {
        in: share_scope,
      };
    }

    if (status && status.length > 0) {
      whereClause.status = {
        in: status,
      };
    }

    if (sort) {
      const [key, order] = sort.split(':');
      orderByClause = {
        [key]: order,
      };
    }

    const [groups, meta] = await this.prismaService.client.group
      .paginate({
        where: whereClause,
        orderBy: orderByClause,
        include: {
          created_by: {
            select: {
              id: true,
              display_name: true,
            },
          },
          menu_items: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      })
      .withPages({
        limit: Number(size),
        page: Number(page),
        includePageCount: true,
      });

    // Get order counts and total quantities for each group
    const groupIds = groups.map((group) => group.id);
    const orderStats = await this.prismaService.client.order.groupBy({
      by: ['group_id'],
      where: {
        group_id: {
          in: groupIds,
        },
        deleted_at: null,
      },
      _count: {
        id: true,
      },
      _sum: {
        quantity: true,
      },
    });

    // Map the order counts and total quantities to each group
    const groupsWithOrderStats = groups.map((group) => {
      const stats = orderStats.find((stat) => stat.group_id === group.id);
      return {
        ...group,
        order_count: stats?._count?.id || 0,
        total_quantity: stats?._sum?.quantity || 0,
      };
    });

    return {
      groups: groupsWithOrderStats,
      meta: camelToSnake(meta),
    };
  }

  async lock(id: string, inviteCode: string, user: RequestWithUser['user']) {
    const group = await this.checkGroupIsLocked(id);
    this.checkInviteCode(group, inviteCode);
    return this.prismaService.client.group.update({
      where: { id, created_by_id: user.id },
      data: { status: GroupStatus.LOCKED },
    });
  }

  // async unlock(id: string, user: RequestWithUser['user']) {
  //   await this.checkGroupIsLocked(id);
  //   return this.prismaService.client.group.update({
  //     where: { id },
  //     data: { status: GroupStatus.INIT },
  //   });
  // }

  @Cron(CronExpression.EVERY_MINUTE)
  /**
   * Cron job that runs every minute to automatically lock groups that have passed their end time
   * Updates status to LOCKED for any groups where:
   * - Current time is after public_end_time
   * - Status is not already LOCKED
   */
  async batchUpdateStatusGroup() {
    const now = dayjs().toDate();

    this.logger.log('Running batch update to lock expired groups');

    try {
      const result = await this.prismaService.client.group.updateMany({
        where: {
          public_end_time: {
            lte: now,
          },
          status: {
            not: GroupStatus.LOCKED,
          },
        },
        data: {
          status: GroupStatus.LOCKED,
        },
      });

      this.logger.log(`Successfully locked ${result.count} expired groups`);
    } catch (error) {
      this.logger.error('Error locking expired groups:', error);
      throw error;
    }
  }

  async checkGroupIsPrivate(id: string) {
    const group = await this.prismaService.client.group.findFirst({
      where: {
        id,
        share_scope: ShareScope.PRIVATE,
        deleted_at: null,
      },
    });

    if (!group) {
      return {
        isPrivate: false,
      };
    }

    return {
      isPrivate: true,
    };
  }
}
