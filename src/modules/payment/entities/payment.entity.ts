import { Column, Entity, ManyToOne, Index } from 'typeorm';
import { RootEntity } from 'src/common/entity/root.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Order } from 'src/modules/order/entities/order.entity';

@Entity()
@Index('payment_user_order_idx', ['user', 'order'], { unique: true })
export class Payment extends RootEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  paymentDate: Date;

  @Column({ type: 'boolean', default: false })
  isSuccessful: boolean;

  @ManyToOne(() => User, (user) => user.payments)
  user: User;

  @ManyToOne(() => Order, (order) => order.payment)
  order: Order;
}