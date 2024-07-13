import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { OrderGroupModule } from './order_groups/order_group.module';
import { TransactionModule } from './transaction/transaction.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

export default [
  UserModule,
  OrderGroupModule,
  OrderModule,
  AuthModule,
  TransactionModule,
  WebhookModule,
];
