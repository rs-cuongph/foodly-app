import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
@Injectable()
export class ChannelLoggerService {
  private readonly winstonLogger: winston.Logger;
  constructor(channelName: string) {
    this.winstonLogger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.DailyRotateFile({
          filename: `logs/${channelName}/%DATE%.log`,
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, trace }) => {
              return `${timestamp} [${channelName}] ${level}: ${message}${trace ? `\n${trace}` : ''}`;
            }),
          ),
        }),
      ],
    });
  }

  log(message: string) {
    this.winstonLogger.info(message);
  }

  error(message: string, trace: string) {
    this.winstonLogger.error(message, { trace });
  }

  warn(message: string) {
    this.winstonLogger.warn(message);
  }

  debug(message: string) {
    this.winstonLogger.debug(message);
  }

  verbose(message: string) {
    this.winstonLogger.verbose(message);
  }
}
