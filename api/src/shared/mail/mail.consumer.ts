import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { QUEUE_NAME_ENUM, JOB_NAME_ENUM } from '@enums/job.enum';

@Processor(QUEUE_NAME_ENUM.MAIL)
export class MailConsumer {
  constructor(private readonly mailService: MailerService) {}

  private logger = new Logger(MailConsumer.name);

  @Process(JOB_NAME_ENUM.SEND_MAIL)
  async sendMail({ data }: Job<ISendMailOptions>) {
    try {
      await this.mailService.sendMail(data);
      this.logger.log(
        `Email ${data.template || ''} has been sent with context ${
          JSON.stringify(data.context) || ''
        }`,
      );
    } catch (e) {
      this.logger.error(
        `An error occur while sending email ${
          data.template || ''
        } with context ${JSON.stringify(data.context) || ''}`,
        e,
      );
    }
  }
}
