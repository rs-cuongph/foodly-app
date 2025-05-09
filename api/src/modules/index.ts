import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { GroupModule } from './group/group.module';
import { WebhookModule } from './webhook/webhook.module';
import { OrganizationModule } from './organization/organization.module';
import { SummaryModule } from './summary/summary.module';
import { ValidatorsModule } from './validator/validator.module';

export default [
  ValidatorsModule,
  AuthModule,
  GroupModule,
  OrderModule,
  TransactionModule,
  WebhookModule,
  MenuModule,
  OrganizationModule,
  SummaryModule,
];
