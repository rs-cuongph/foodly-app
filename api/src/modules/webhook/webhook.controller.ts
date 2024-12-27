/* eslint-disable @typescript-eslint/no-unused-vars */
import { Public } from '@decorators/auth.decorator';
import { WebhookService } from './webhook.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WebhookResponseDataType } from 'src/types/bank.type';

@Controller('webhook')
@Public()
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('confirm-transaction')
  @HttpCode(HttpStatus.OK)
  async confirmTransaction(@Body() body: WebhookResponseDataType) {
    return this.webhookService.confirmTransaction(body);
  }
}
