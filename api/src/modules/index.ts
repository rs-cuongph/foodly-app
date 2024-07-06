import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { OrderGroupModule } from './order_groups/order_group.module';
import { UsersModule } from './users/users.module';

export default [UsersModule, OrderGroupModule, OrderModule, AuthModule];
