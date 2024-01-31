import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Order, Book, User])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
