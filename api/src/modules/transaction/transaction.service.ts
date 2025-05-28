/* eslint-disable @typescript-eslint/no-unused-vars */
/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ORDER_STATUS_ENUM, TRANSACTION_ENUM } from '@enums/status.enum';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { CustomPrismaService } from 'nestjs-prisma';
import { WebhookResponseDataType } from 'src/types/bank.type';
import { I18nService } from 'nestjs-i18n';
import { TransactionType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
    private readonly i18n: I18nService,
  ) {}

  public async confirmTransaction(body: WebhookResponseDataType) {
    console.log(body);

    const transCode = body.payment.content;
    if (!transCode) {
      throw new BadRequestException(
        this.i18n.t('message.trans_code_is_required'),
      );
    }

    const transaction = await this.prismaService.client.transaction.findFirst({
      where: {
        unique_code: transCode,
      },
    });

    if (!transaction) {
      throw new BadRequestException(
        this.i18n.t('message.transaction_not_match'),
      );
    }

    // verify transaction

    if (
      ![
        TRANSACTION_ENUM.INIT,
        TRANSACTION_ENUM.PROCESSING,
        TRANSACTION_ENUM.AWAITING_CONFIRMATION,
      ].includes(transaction.status as TRANSACTION_ENUM)
    ) {
      throw new BadRequestException(
        this.i18n.t('message.transaction_not_in_init_status'),
      );
    }

    // verify transaction amount
    if (Number(transaction.total_amount) !== Number(body.payment.amount)) {
      throw new BadRequestException(
        this.i18n.t('message.transaction_not_match'),
      );
    }

    if (transaction.type === TransactionType.SETTLEMENT) {
      await this.prismaService.client.$transaction(async (tx) => {
        await tx.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: TRANSACTION_ENUM.COMPLETED,
          },
        });

        const orders = await tx.order.findMany({
          where: {
            transaction_id: transaction.id,
          },
        });

        await tx.order.updateMany({
          where: {
            id: {
              in: orders.map((i) => i.id),
            },
          },
          data: {
            status: ORDER_STATUS_ENUM.COMPLETED,
          },
        });
      });
    }

    if (transaction.type === TransactionType.SINGLE_ORDER) {
      await this.prismaService.client.$transaction(async (tx) => {
        await tx.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: TRANSACTION_ENUM.COMPLETED,
          },
        });

        const order = await tx.order.findFirst({
          where: {
            transaction_id: transaction.id,
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
      });
    }

    return {
      success: true,
    };
  }

  // async scan(body: ScanTransactionDTO) {
  //   const { qr_text } = body;

  //   const transaction = await this.prismaService.client.transaction.findFirst({
  //     where: {
  //       unique_code: qr_text,
  //     },
  //   });

  //   if (!transaction) {
  //     throw new BadRequestException(this.i18n.t('error.transaction_not_found'));
  //   }

  //   if (
  //     ![
  //       TRANSACTION_ENUM.INIT,
  //       TRANSACTION_ENUM.PROCESSING,
  //       TRANSACTION_ENUM.AWAITING_CONFIRMATION,
  //     ].includes(transaction.status as TRANSACTION_ENUM)
  //   ) {
  //     throw new BadRequestException(
  //       this.i18n.t('error.transaction_not_in_init_status'),
  //     );
  //   }

  //   if (transaction.type === TransactionType.SETTLEMENT) {
  //     await this.prismaService.client.$transaction(async (tx) => {
  //       await tx.transaction.update({
  //         where: {
  //           id: transaction.id,
  //         },
  //         data: {
  //           status: TRANSACTION_ENUM.COMPLETED,
  //         },
  //       });

  //       const orders = await tx.order.findMany({
  //         where: {
  //           transaction_id: transaction.id,
  //         },
  //       });

  //       await tx.order.updateMany({
  //         where: {
  //           id: {
  //             in: orders.map((i) => i.id),
  //           },
  //         },
  //         data: {
  //           status: ORDER_STATUS_ENUM.COMPLETED,
  //         },
  //       });
  //     });
  //   }

  //   if (transaction.type === TransactionType.SINGLE_ORDER) {
  //     await this.prismaService.client.$transaction(async (tx) => {
  //       await tx.transaction.update({
  //         where: {
  //           id: transaction.id,
  //         },
  //         data: {
  //           status: TRANSACTION_ENUM.COMPLETED,
  //         },
  //       });

  //       const order = await tx.order.findFirst({
  //         where: {
  //           transaction_id: transaction.id,
  //         },
  //       });

  //       await tx.order.update({
  //         where: {
  //           id: order.id,
  //         },
  //         data: {
  //           status: ORDER_STATUS_ENUM.COMPLETED,
  //         },
  //       });
  //     });
  //   }

  //   return {
  //     success: true,
  //   };
  // }
}
