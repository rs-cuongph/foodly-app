import { Injectable, Logger } from '@nestjs/common';
import { CustomPrismaClientFactory, QueryInfo } from 'nestjs-prisma';
import { CustomPrismaClient, ExtendedPrismaClient } from './prisma.extension';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ExtendedPrismaConfigService
  implements CustomPrismaClientFactory<ExtendedPrismaClient>
{
  constructor(private configService: ConfigService) {}
  createPrismaClient(): ExtendedPrismaClient {
    return CustomPrismaClient({
      loggingOpts: {
        logger: new Logger(),
        logLevel: this.configService.get('prisma.logLevel'),
        logMessage: (query: QueryInfo) =>
          `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
      },
    });
  }
}
