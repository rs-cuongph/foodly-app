import { Injectable, Logger } from '@nestjs/common';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JOB_NAME_ENUM, QUEUE_NAME_ENUM } from '@enums/job.enum';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue(QUEUE_NAME_ENUM.MAIL) private readonly mailQueue: Queue,
  ) {}

  private logger = new Logger(MailService.name);

  async sendMail(options: ISendMailOptions) {
    try {
      if (this.configService.get('app.nodeEnv') === 'test') {
        return true;
      }
      this.logger.log(`====> start send to job ${JOB_NAME_ENUM.SEND_MAIL}`);
      await this.mailQueue.add(JOB_NAME_ENUM.SEND_MAIL, options);
      return true;
    } catch (e) {
      this.logger.error('An error occur while adding send mail job', e);
      return false;
    }
  }

  async sendPasswordResetMail(
    to: string,
    resetToken: string,
    redirectUrl: string,
  ) {
    try {
      const subject = 'Đặt lại mật khẩu';
      const resetLink = redirectUrl
        ? `${redirectUrl}?token=${resetToken}&modal=reset_password`
        : `${this.configService.get('mail.frontendUrl')}/reset-password?token=${resetToken}`;
      await this.sendMail({
        to,
        subject,
        template: 'reset-password',
        context: {
          resetLink,
        },
      });
    } catch (error) {
      this.logger.error(
        `An error occur while sending password reset mail to ${to} with token ${resetToken}`,
        error,
      );
    }
  }

  async sendLoginCodeMail(to: string, loginCode: string) {
    const subject = 'Mã đăng nhập Foodly';
    await this.sendMail({
      to,
      subject,
      template: 'login-code',
      context: {
        loginCode,
      },
    });
  }
}
