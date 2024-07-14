import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TransactionRepository } from '@modules/transaction/transaction.repository';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    { provide: 'TransactionInterface', useClass: TransactionRepository },
  ],
})
export class WebhookModule {}
