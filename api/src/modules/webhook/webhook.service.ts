import { ConfigService } from '@nestjs/config';
/*
https://docs.nestjs.com/providers#services
*/
import { TransactionService } from '@modules/transaction/transaction.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { WebhookResponseDataType } from 'src/types/bank.type';

@Injectable()
export class WebhookService {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly config: ConfigService,
  ) {}

  private async verifySignature(token: string) {
    return token === this.config.get('webhook.token');
  }

  public async confirmTransaction(body: WebhookResponseDataType) {
    const isVerified = await this.verifySignature(body.token);
    if (!isVerified) {
      throw new BadRequestException('Invalid signature');
    }

    return this.transactionService.confirmTransaction(body);
  }
}
