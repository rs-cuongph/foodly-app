/*
https://docs.nestjs.com/providers#services
*/

import { TransactionInterface } from '@modules/transaction/transaction.repositiory.interface';
import {
  BadGatewayException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { WebhookResponseDataType } from 'src/types/payos.type';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transactionRepository: TransactionInterface,
  ) {}
  public async confirmTransaction(body: WebhookResponseDataType) {
    try {
      // const find = await this.transactionRepository.findByCondition({
      //   paymentLinkId: body.data.paymentLinkId,
      // });
      // if (!find) throw new NotFoundException('not found');
      // const metadata = [
      //   ...find.metadata,

      // ]
      // const update = await this.transactionRepository.update(
      //   {
      //     id: find.id
      //   },
      //   {
      //     metadata: find.metadata,
      //   }
      // )
      // if()
      return true;
    } catch (e) {
      throw new BadGatewayException(e);
    }
  }
}
