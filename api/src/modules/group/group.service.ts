/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create.dto';
import * as _ from 'lodash';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';
import * as dayjs from 'dayjs';
import { RequestWithUser } from 'src/types/requests.type';
import { EditGroupDto } from './dto/edit.dto';
import { SearchGroupDTO } from './dto/search.dto';
import { Prisma } from '@prisma/client';
import { camelToSnake } from 'src/shared/convert';

@Injectable()
export class GroupService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async create(body: CreateGroupDto, user: RequestWithUser['user']) {
    try {
      let nextID = '0000000001';
      const lastGroup = await this.prismaService.client.group.findFirst({
        orderBy: {
          id: 'desc',
        },
      });
      if (lastGroup && lastGroup.code) {
        nextID = _.padStart((Number(lastGroup.code) + 1).toString(), 10, '0');
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

  async edit(id: string, body: EditGroupDto, user: RequestWithUser['user']) {
    return this.prismaService.client.$transaction(async (tx) => {
      const group = await tx.group.update({
        where: {
          id: Number(id),
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
              id: item?.id ?? 0,
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

  async delete(id: string) {
    return this.prismaService.client.group.softDelete({
      id: Number(id),
    });
  }

  async show(id: string) {
    return this.prismaService.client.group.findFirstOrThrow({
      where: {
        id: Number(id),
      },
    });
  }

  async search(query: SearchGroupDTO, user: RequestWithUser['user']) {
    const { keyword, sort, page, size, is_online, is_mine } = query;
    const whereClause: Prisma.GroupWhereInput = {};
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
}
