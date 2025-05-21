import { MailerOptionsFactory } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class MailConfig implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions() {
    const transportConfig = this._getTransportConfig();
    console.log('transportConfig', transportConfig);
    return {
      transport: {
        host: transportConfig.host,
        port: transportConfig.port,
        secure: transportConfig.secure,
        auth: {
          user: transportConfig.username,
          pass: transportConfig.password,
        },
      },
      defaults: {
        from: `${this.configService.get('mail.mailFrom')}`,
      },
      template: {
        dir: join(__dirname, '../../../', 'templates/'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
      preview: this.configService.get('app.nodeEnv') === 'development',
    };
  }

  private _getTransportConfig() {
    const provider = this.configService.get('mail.provider');
    switch (provider) {
      case 'maildev':
        return {
          host: this.configService.get('mail.maildev.host'),
          port: this.configService.get('mail.maildev.port'),
          secure: false,
          username: this.configService.get('mail.maildev.username'),
          password: this.configService.get('mail.maildev.password'),
        };
      case 'gmail':
        return {
          host: this.configService.get('mail.gmail.host'),
          port: this.configService.get('mail.gmail.port'),
          secure: this.configService.get('mail.gmail.secure'),
          username: this.configService.get('mail.gmail.username'),
          password: this.configService.get('mail.gmail.password'),
        };
      default:
        throw Error(`Email provider ${provider} doesn't support yet`);
    }
  }
}
