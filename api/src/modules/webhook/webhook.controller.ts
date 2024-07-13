import { WebhookService } from './webhook.service';
/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { WebhookResponseDataType } from 'src/types/payos.type';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('confirm-transaction')
  @HttpCode(HttpStatus.OK)
  async confirmTransaction(@Body() body: WebhookResponseDataType) {
    console.log(' =>  =>  => ', body);
    // await this.webhookService.confirmTransaction(body);
    return {
      success: true,
    };
  }
}
