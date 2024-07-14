import { HttpService } from '@nestjs/axios';
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
import { TransactionStatus } from '@prisma/client';
import { WebhookResponseDataType } from 'src/types/payos.type';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('TransactionInterface')
    private readonly transactionRepository: TransactionInterface,
    private readonly httpService: HttpService,
  ) {}
  public async confirmTransaction(body: WebhookResponseDataType) {
    try {
      const find = await this.transactionRepository.findByCondition({
        paymentLinkId: body.data.paymentLinkId,
      });
      if (!find) throw new NotFoundException('not found');
      console.log('===> find:', find);
      const metadata = JSON.parse(JSON.stringify(find.metadata));
      await this.transactionRepository.update(
        {
          id: find.id,
        },
        {
          status: TransactionStatus.COMPLETED,
        },
      );
      if (metadata?.callbackURL) {
        await this.httpService.post(metadata.callbackURL, metadata).toPromise();
      }

      return true;
    } catch (e) {
      throw new BadGatewayException(e);
    }
  }
}
