import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailConfig } from './mail.config';
import { MailConsumer } from './mail.consumer';
import { BullModule } from '@nestjs/bull';
import { QUEUE_NAME_ENUM } from '@enums/job.enum';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailConfig,
    }),
    BullModule.registerQueue({ name: QUEUE_NAME_ENUM.MAIL }),
    BullBoardModule.forFeature({
      name: 'mail-queue',
      adapter: BullAdapter,
    }),
  ],
  providers: [MailService, MailConsumer],
  exports: [MailService],
})
export class MailModule {}
