import { Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { QueryInfo } from 'nestjs-prisma';
export interface LoggingOptions {
  logger: Console | Logger;
  logLevel: 'log' | 'debug' | 'warn' | 'error';
  /**
   * Create a custom log message.
   */
  logMessage?: (query: QueryInfo) => string;
}
export const QueryLoggingExt = (
  { logger, logMessage, logLevel }: LoggingOptions = {
    logger: console,
    logLevel: 'debug',
  },
) =>
  Prisma.defineExtension((client) => {
    // The Prisma Client instance that the extension user applies the extension to
    return client.$extends({
      name: 'prisma-extension-query-logging',
      query: {
        $allModels: {
          async $allOperations({ args, model, query, operation }) {
            const before = performance.now();
            const result = await query(args);
            const after = performance.now();
            const executionTime = Number((after - before).toFixed(2));
            if (process.env.PRISMA_ENABLE_LOG == 'true') {
              if (logMessage) {
                logger[logLevel](
                  logMessage({
                    model: model!,
                    action: operation,
                    before,
                    after,
                    executionTime,
                  }),
                );
              } else {
                logger[logLevel](
                  `Prisma Query ${model}.${operation} took ${executionTime}ms`,
                );
              }
            }
            return result;
          },
        },
      },
    });
  });
