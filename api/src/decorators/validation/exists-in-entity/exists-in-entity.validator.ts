import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';
import { Prisma } from '@prisma/client';

@ValidatorConstraint({ name: 'ExistsInEntity', async: true })
@Injectable()
export class ExistsInEntityConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async validate(value: string, args: ValidationArguments) {
    const entity = args.constraints[0] as keyof Prisma.ModelName;
    const property = args.constraints[1] as string;
    // Type-safe way to access Prisma models
    const model = this.prismaService.client[entity];
    if (!model || typeof model.findFirst !== 'function') {
      return false;
    }

    const where = {
      [property]: value,
    } as any; // Need to use any here since we can't type dynamic property access

    const record = await model.findFirst({
      where,
    });

    return !!record;
  }

  defaultMessage(args: ValidationArguments) {
    return i18nValidationMessage('validation.ExistsInEntity', {
      property: args.property,
    })(args);
  }
}
