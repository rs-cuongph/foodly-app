/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { PayOSService } from 'src/services/payos.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [TransactionController],
  providers: [PayOSService, TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
