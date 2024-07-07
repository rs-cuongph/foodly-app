import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { OrderGroupModule } from './order_groups/order_group.module';
import { UserModule } from './users/user.module';

export default [UserModule, OrderGroupModule, OrderModule, AuthModule];
