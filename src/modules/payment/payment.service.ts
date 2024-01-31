import { FindAllpaymentDto } from './dto/findAll-payment.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { DeepPartial, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';
import { PaymentAlreadySuccessfulException } from 'src/common/http/PAS-exeption';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>
  ) {}
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    try {
      const { userId, orderId } = createPaymentDto;
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const order = await this.orderRepo.findOne({ where: { id: orderId } });
      if (!order) {
        throw new NotFoundException(`Order with ID ${orderId} not found`);
      }
      const amount = order.totalAmount;
      const payment = this.paymentRepo.create({
        user,
        order,
        amount,
      });
      await this.paymentRepo.save(payment);
      return payment;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  async findAll(findAllpaymentDto: FindAllpaymentDto) {
    try {
      const totalPostCount = await this.paymentRepo.count()
      const { page, limit } = findAllpaymentDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const payment = await this.paymentRepo.find({
        take: limit,
        skip: pagination.offset
      })
      return new ApiResponse(payment, pagination)
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number) {
    try {
      const payment = await this.paymentRepo.findOneBy({ id })
      return payment
    } catch (error) {
      throw error
    }
  }
  async update(id: number, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    try {
      const payment = await this.paymentRepo.findOne({ where: { id } });
      if (!payment) {
        throw new NotFoundException(`Payment with ID ${id} not found`);
      }
      if (payment.isSuccessful) {
        throw new PaymentAlreadySuccessfulException(id);
      }
      this.paymentRepo.merge(payment, updatePaymentDto as DeepPartial<Payment>);
      await this.paymentRepo.save(payment);
      return payment;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  async remove(id: number) {
    try {
      const payment = await this.paymentRepo.findOneBy({ id })
      if (!payment) {
        throw new NotFoundException(`Payment wwith id: ${id} not found`)
      }
      this.paymentRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}
