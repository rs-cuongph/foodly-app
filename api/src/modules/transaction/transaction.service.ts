/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create.dto';
import { TransactionInterface } from './transaction.repositiory.interface';
import * as dayjs from 'dayjs';
import { PayOSService } from 'src/services/payos.service';
import { map } from 'rxjs';
import { TRANSACTION_ENUM } from 'src/enums/status.enum';

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
      };

      return this.payosService
        .createPaymentLink({
          amount: metadata.amount,
          orderCode: 1,
          description: '',
          cancelUrl: '',
          returnUrl: '',
          expiredAt: dayjs().add(30, 'minutes').unix() * 1000,
        })
        .pipe(
          map(async (res) => {
            await this.transactionRepository.create({
              metadata: {
                ...metadata,
                payos: res.data,
              },
              paymentLinkId: res.data.paymentLinkId,
              status: TRANSACTION_ENUM.PROCESSING,
            });
            return {
              message: 'success',
              data: {},
            };
          }),
        )
        .subscribe();
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}
