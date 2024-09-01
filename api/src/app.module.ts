import { WebhookModule } from './modules/webhook/webhook.module';
import { TransactionController } from './modules/transaction/transaction.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import configs from './configs';
import { BullModule } from '@nestjs/bull';
import modules from './modules';
import { LoggerModule } from 'nestjs-pino';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from '@filters/http_exception.filter';
import { CustomPrismaModule, PrismaModule } from 'nestjs-prisma';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtAccessTokenGuard } from '@modules/auth/guards/jwt-access-token.guard';
import { ExtendedPrismaConfigService } from './services/prisma-config.service';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        APP_FALLBACK_LANGUAGE: Joi.string().default('en').required(),
        APP_HEADER_LANGUAGE: Joi.string().default('en').required(),
        DATABASE_URL: Joi.string().required(),
        JWT_ACCESS_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.string().required(),
        JWT_REFRESH_IN: Joi.string().required(),
        PAYOS_CLIENT_ID: Joi.string().required(),
        PAYOS_API_KEY: Joi.string().required(),
        PAYOS_CHECKSUM_KEY: Joi.string().required(),
      }),
      isGlobal: true,
      load: [configs],
    }),
    CustomPrismaModule.forRootAsync({
      isGlobal: true,
      name: 'PrismaService',
      useClass: ExtendedPrismaConfigService,
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get<string>('app.fallbackLanguage'),
        loaderOptions: {
          path: join(__dirname, '..', 'i18n'),
          watch: true,
        },
      }),
      resolvers: [
        new QueryResolver(['lang', 'locale', 'l']),
        new CookieResolver(),
        new HeaderResolver(['lang']),
        new AcceptLanguageResolver(),
      ],
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('app.redis_host'),
            port: configService.get('app.redis_port'),
          },
        };
      },
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
        },
      },
    }),

    ...modules,
  ],
  controllers: [TransactionController, AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenGuard,
    },
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter,
    // },
  ],
})
export class AppModule {}
