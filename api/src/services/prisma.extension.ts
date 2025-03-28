import { PrismaClient, Prisma } from '@prisma/client';
import { LoggingOptions, QueryLoggingExt } from 'prisma/extendsion/logger';
import { SoftDeleteExt } from 'prisma/extendsion/soft-delete';
import PaginationExt from 'prisma-extension-pagination';

interface CustomPrismaClientOpts {
  loggingOpts: LoggingOptions;
}

export const CustomPrismaClient = (options: CustomPrismaClientOpts) => {
  return new PrismaClient<
    Prisma.PrismaClientOptions,
    'query' | 'info' | 'warn' | 'error'
  >({
    log: process.env.PRISMA_ENABLE_LOG == 'true' ? ['query', 'info'] : [],
    transactionOptions: {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    },
  })
    .$extends(QueryLoggingExt(options.loggingOpts))
    .$extends(SoftDeleteExt())
    .$extends(PaginationExt());
};

export type ExtendedPrismaClient = ReturnType<typeof CustomPrismaClient>;
