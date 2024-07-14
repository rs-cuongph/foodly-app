/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create.dto';
import { TransactionInterface } from './transaction.repositiory.interface';
import * as dayjs from 'dayjs';
import { PayOSService } from 'src/services/payos.service';
import { TRANSACTION_ENUM } from 'src/enums/status.enum';
import { Transaction } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transactionRepository: TransactionInterface,
    private readonly payosService: PayOSService,
  ) {}

  public async createTransaction(body: CreateTransactionDto) {
    try {
      const metadata = {
        amount: body.amount,
        orderIds: body.orderIds,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        callbackURL: body.callbackURL,
      };
      const callback = async (trans: Transaction) => {
        const result = await this.payosService
          .createPaymentLink({
            amount: trans.metadata['amount'],
            orderCode: trans.id,
            description: '',
            cancelUrl: '',
            returnUrl: '',
            expiredAt: dayjs().add(30, 'minutes').unix(),
          })
          .toPromise();
        if (result?.code == '00') {
          return {
            message: 'success',
            data: result,
          };
        } else {
          throw new BadRequestException(result?.desc || 'API ERROR');
        }
      };
      return this.transactionRepository.create(
        {
          metadata: {
            ...metadata,
          },
          status: TRANSACTION_ENUM.PROCESSING,
        },
        callback,
      );
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}