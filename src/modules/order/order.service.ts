import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { Book } from '../books/entities/book.entity';
import { User } from '../user/entities/user.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
  ) { }
  async create(createOrderDto: CreateOrderDto) {
    try {
      const { userId, bookIds } = createOrderDto;
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const books = await this.bookRepo.find({ where: { id: In(bookIds) } });
      if (!books || books.length !== bookIds.length) {
        throw new NotFoundException('One or more books not found');
      }
      console.log(books);
      let totalAmount = 0;
      books.forEach((book) => {
        const price = typeof book.price === 'string' ? parseFloat(book.price) : book.price;
        if (isNaN(price)) {
          throw new Error(`Invalid price value for book ${book.id}`);
        }
        totalAmount += price;
      });
      if (isNaN(totalAmount)) {
        throw new Error('Invalid totalAmount value');
      }
      const order = this.orderRepo.create({
        user,
        books,
        totalAmount,
        status: createOrderDto.status,
      });
      await this.orderRepo.save(order);
      return "success";
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  findAll() {
    return `This action returns all order`;
  }
  async findOne(id: number) {
    try {
      const order = await this.orderRepo.findOneBy({ id })
      return order
    } catch (error) {
      throw error
    }
  }
  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      const { userId, bookIds } = updateOrderDto;
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const books = await this.bookRepo.find({ where: { id: In(bookIds) } });
      if (!books || books.length !== bookIds.length) {
        throw new NotFoundException('One or more books not found');
      }
      let totalAmount = 0;
      books.forEach((book) => {
        const price = typeof book.price === 'string' ? parseFloat(book.price) : book.price;
        if (isNaN(price)) {
          throw new Error(`Invalid price value for book ${book.id}`);
        }
        totalAmount += price;
      });
      if (isNaN(totalAmount)) {
        throw new Error('Invalid totalAmount value');
      }
      const order = await this.orderRepo.findOne({ where: { id } });
      if (!order) {
        throw new NotFoundException(`Order with ID ${id} not found`);
      }
      order.user = user;
      order.books = books;
      order.totalAmount = totalAmount;
      order.status = updateOrderDto.status;
      await this.orderRepo.save(order);
      return "success";
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  async remove(id: number) {
    try {
      const order = await this.orderRepo.findOneBy({ id })
      if (!order) {
        throw new NotFoundException(`Order wwith id: ${id} not found`)
      }
      this.orderRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}

