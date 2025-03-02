import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import {
  HttpStatus,
  Logger as RootLogger,
  ValidationPipe,
} from '@nestjs/common';
import {
  I18nValidationExceptionFilter,
  i18nValidationErrorFactory,
} from 'nestjs-i18n';
import { formatErrors } from './utils/format-error-http';
import { configSwagger } from '@configs/api-docs.config';
import { useContainer } from 'class-validator';
import { PrismaClientExceptionFilter } from '@filters/prisma-client-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: ['error', 'warn', 'debug', 'log'],
  });
  configSwagger(app);
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('/api');
  app.enableCors();
  const logger = new RootLogger(bootstrap.name);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
      whitelist: true,
      stopAtFirstError: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(
    new I18nValidationExceptionFilter({
      errorFormatter: formatErrors,
      errorHttpStatusCode: 422,
    }),
    new PrismaClientExceptionFilter(httpAdapter, {
      // Prisma Error Code: HTTP Status Response
      P2000: HttpStatus.BAD_REQUEST,
      P2002: HttpStatus.CONFLICT,
      P2025: HttpStatus.NOT_FOUND,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(configService.get('app.port'), () => {
    logger.log(`Application running on port ${configService.get('app.port')}`);
  });
}
bootstrap();
