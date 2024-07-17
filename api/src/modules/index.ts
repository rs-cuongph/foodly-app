import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { TransactionModule } from './transaction/transaction.module';
import { OrderGroupModule } from './order_group/order_group.module';
import { UserModule } from './user/user.module';
import { WebhookModule } from './webhook/webhook.module';

export default [
  UserModule,
  OrderGroupModule,
  OrderModule,
  AuthModule,
  TransactionModule,
  WebhookModule,
  MenuModule,
];
