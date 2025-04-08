import { Module } from '@nestjs/common';
import { IsEmailUniqueConstraint } from '@decorators/validation/email-unique/email-unique.validator';
import { ExistsInEntityConstraint } from '@decorators/validation/exists-in-entity/exists-in-entity.validator';

@Module({
  providers: [IsEmailUniqueConstraint, ExistsInEntityConstraint],
  exports: [IsEmailUniqueConstraint, ExistsInEntityConstraint],
})
export class ValidatorsModule {}
