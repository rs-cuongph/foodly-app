import { Inject, Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';
import { CustomPrismaService } from 'nestjs-prisma';
import { ExtendedPrismaClient } from 'src/services/prisma.extension';

@ValidatorConstraint({ name: 'IsEmailUnique', async: true })
@Injectable()
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  constructor(
    @Inject('PrismaService')
    private prismaService: CustomPrismaService<ExtendedPrismaClient>,
  ) {}

  async validate(email: string, args: ValidationArguments) {
    const { organization_code } = args.object as { organization_code: string };

    const user = await this.prismaService.client.user.findFirst({
      where: {
        email,
        organization: {
          code: organization_code,
        },
      },
    });
    return !user;
  }

  defaultMessage(args: ValidationArguments) {
    return i18nValidationMessage('validation.IsEmailUnique', {
      property: args.property,
    })(args);
  }
}
