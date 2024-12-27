/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { TransactionModule } from '@modules/transaction/transaction.module';

@Module({
  imports: [HttpModule, TransactionModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
