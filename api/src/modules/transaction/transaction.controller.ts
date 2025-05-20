/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Patch, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
// import { ScanTransactionDTO } from './dto/create.dto';
// import { Public } from '@decorators/auth.decorator';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // @Post('/:id/payos')
  // createPaymentLink(@Param('id') id: string) {
  //   return this.transactionService.createPaymentLink(id);
  // }
  // @Post('/create')
  // createTransaction(@Body() body: CreateTransactionDTO) {
  //   return this.transactionService.createTransaction(body);
  // }

  // TODO: for testing
  // @Public()
  // @Patch('/scan')
  // scan(@Body() body: ScanTransactionDTO) {
  //   return this.transactionService.scan(body);
  // }
}
