/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/')
  createTransaction(@Body() body: CreateTransactionDto) {
    return this.transactionService.createTransaction(body);
  }
}
