/* eslint-disable @typescript-eslint/no-unused-vars */
/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDTO } from './dto/create.dto';
import * as dayjs from 'dayjs';
import { PayOSService } from 'src/services/payos.service';
import { ORDER_STATUS_ENUM, TRANSACTION_ENUM } from 'src/enums/status.enum';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';
import { WebhookResponseDataType } from 'src/types/bank.type';
import { convertToUUID } from 'src/shared/convert';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly payosService: PayOSService,
  ) {}

  public async createPaymentLink(id: string) {
    const data =
      await this.prismaService.client.orderOnTransaction.findFirstOrThrow({
        where: {
          transaction_id: id,
          order: {
            status: {
              in: [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
            },
          },
          transaction: {
            status: {
              in: [TRANSACTION_ENUM.PROCESSING, TRANSACTION_ENUM.INIT],
            },
          },
        },

        include: {
          order: true,
          transaction: true,
        },
      });

    const payos_order_code = dayjs().format('YYYYMMDDHHmmss');

    const metadata = {
      payos_order_code,
      trans_id: data.transaction.id.split('-').join(''),
      amount: data.transaction.metadata['amount'],
      order_ids: [data.order.id],
      created_at: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      callback_url: '',
    };

    //   const result = await this.payosService
    //     .createPaymentLink({
    //       amount: metadata['amount'],
    //       orderCode: metadata.trans_id,
    //       description: '',
    //       cancelUrl: '',
    //       returnUrl: '',
    //       expiredAt: dayjs().add(30, 'minutes').unix(),
    //     })
    //     .toPromise();
    //   if (result?.code == '00') {
    //     return {
    //       message: 'success',
    //       data: result,
    //     };
    //   } else {
    //     throw new BadRequestException(result?.desc || 'API ERROR');
    //   }
  }

  public async confirmTransaction(body: WebhookResponseDataType) {
    return this.prismaService.client.$transaction(async (tx) => {
      const transactionId = body.payment.content;
      if (!transactionId) {
        throw new BadRequestException('Transaction ID is required');
      }

      const orderOnTransactions = await tx.orderOnTransaction.findMany({
        where: {
          transaction_id: convertToUUID(transactionId),
          order: {
            status: {
              in: [ORDER_STATUS_ENUM.INIT, ORDER_STATUS_ENUM.PROCESSING],
            },
          },
          transaction: {
            status: {
              in: [TRANSACTION_ENUM.PROCESSING, TRANSACTION_ENUM.INIT],
            },
          },
        },
        include: {
          order: true,
          transaction: true,
        },
      });

      if (orderOnTransactions.length === 0) {
        throw new BadRequestException('Transaction not found');
      }

      if (orderOnTransactions.length === 1) {
        const order = orderOnTransactions[0].order;
        const transaction = orderOnTransactions[0].transaction;
        if (transaction.metadata['amount'] > body.payment.amount) {
          throw new BadRequestException('Amount is not enough');
        }
        await tx.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: TRANSACTION_ENUM.COMPLETED,
          },
        });

        await tx.order.update({
          where: {
            id: order.id,
          },
          data: {
            status: ORDER_STATUS_ENUM.COMPLETED,
          },
        });

        return {
          success: true,
        };
      } else {
        // TODO: handle multiple order

        return {
          success: true,
        };
      }
    });
  }
}
