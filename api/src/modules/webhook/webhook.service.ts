/*
https://docs.nestjs.com/providers#services
*/
import { TransactionService } from '@modules/transaction/transaction.service';
import { Injectable } from '@nestjs/common';
import { WebhookResponseDataType } from 'src/types/bank.type';

@Injectable()
export class WebhookService {
  constructor(private readonly transactionService: TransactionService) {}

  public async confirmTransaction(body: WebhookResponseDataType) {
    return this.transactionService.confirmTransaction(body);
  }
}
