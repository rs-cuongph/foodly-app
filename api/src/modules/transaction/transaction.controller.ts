/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDTO } from './dto/create.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('/')
  createTransaction(@Body() body: CreateTransactionDTO) {
    return this.transactionService.createTransaction(body);
  }
}
