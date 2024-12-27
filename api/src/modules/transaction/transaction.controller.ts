/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/:id/payos')
  createPaymentLink(@Param('id') id: string) {
    return this.transactionService.createPaymentLink(id);
  }
}
