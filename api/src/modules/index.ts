import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { OrderModule } from './order/order.module';
import { OrderGroupModule } from './order_group/order_group.module';
import { UserModule } from './user/user.module';

export default [UserModule, OrderGroupModule, OrderModule, AuthModule, MenuModule];
