/* eslint-disable @typescript-eslint/no-unused-vars */
import { Prisma } from '@prisma/client';
import * as dayjs from 'dayjs';
import { isUndefined } from 'lodash';

export const SoftDeleteExt = () =>
  Prisma.defineExtension((client) => {
    // The Prisma Client instance that the extension user applies the extension to
    return client.$extends({
      name: 'prisma-extension-soft-delete',
      query: {
        $allModels: {
          async $allOperations({ args, operation, query, model }) {
            const newArgs: any = args;
            // if (
            //   [
            //     'findFirst',
            //     'findFirstOrThrow',
            //     'findMany',
            //     'update',
            //     'updateMany',
            //     'count',
            //   ].includes(operation)
            // ) {
            //   if (
            //     ![
            //       'Contract_Flow',
            //       'Contract_Amount_Phase',
            //       'Master_Field',
            //       'Master_Sponsor_Type',
            //       'Contract_Status',
            //     ].includes(model) &&
            //     newArgs?.where &&
            //     isUndefined(newArgs?.where?.deleted_at)
            //   ) {
            //     newArgs['where']['deleted_at'] = null;
            //   }
            // }
            const result = await query(newArgs);
            return result;
          },
        },
      },
      model: {
        $allModels: {
          async softDelete<M, A>(
            this: M,
            where: Prisma.Args<M, 'update'>['where'],
          ): Promise<Prisma.Result<M, A, 'update'>> {
            const context = Prisma.getExtensionContext(this);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- There is no way to type a Prisma model
            return (context as any).update({
              where,
              data: {
                deleted_at: dayjs().toDate(),
              },
            });
          },
          async softDeleteMany<M, A>(
            this: M,
            where: Prisma.Args<M, 'updateMany'>['where'],
          ): Promise<Prisma.Result<M, A, 'updateMany'>> {
            const context = Prisma.getExtensionContext(this);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- There is no way to type a Prisma model
            return (context as any).updateMany({
              where,
              data: {
                deleted_at: dayjs().toDate(),
              },
            });
          },
          async isDeleted<M>(
            this: M,
            where: Prisma.Args<M, 'findUnique'>['where'],
          ): Promise<boolean> {
            const context = Prisma.getExtensionContext(this);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any -- There is no way to type a Prisma model
            const result = await (context as any).findUnique({ where });

            return !!result.deleted_at;
          },
        },
      },
    });
  });
