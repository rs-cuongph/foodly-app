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
      const group = await tx.group.update({
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
    user: RequestWithUser['user'],
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
    if (findGroup.created_by_id === user.id) {
      return findGroup;
    }

    if (findGroup.status == GroupStatus.INIT) {
      this.checkInviteCode(findGroup, query.invite_code);
    }
    return findGroup;
  }

  async search(query: SearchGroupDTO, user: RequestWithUser['user']) {
    const { keyword, sort, page, size, is_online, is_mine } = query;
    const whereClause: Prisma.GroupWhereInput = {
      share_scope: {
        in: [ShareScope.PUBLIC],
      },
    };
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

    if (is_mine && is_mine == 1) {
      whereClause.AND = {
        created_by_id: user.id,
      };
    }

    if (is_online && is_online == 1) {
      whereClause.AND = {
        public_start_time: {
          lte: dayjs().toDate(),
        },
        public_end_time: {
          gte: dayjs().toDate(),
        },
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
      })
      .withPages({
        limit: Number(size),
        page: Number(page),
        includePageCount: true,
      });
    return {
      groups,
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
}
