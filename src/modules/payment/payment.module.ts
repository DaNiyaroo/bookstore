import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Payment, User,Order])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
