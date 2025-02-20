/*
https://docs.nestjs.com/controllers#controllers
*/

import { Controller, Get, Param } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { Public } from '@decorators/auth.decorator';

@Controller('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Public()
  @Get('/')
  index() {
    return this.organizationService.index();
  }

  @Public()
  @Get('/:organization_code')
  get(@Param('organization_code') organization_code: string) {
    return this.organizationService.get(organization_code);
  }
}
