import { FindAllBasketDto } from './dto/findAll-basket.dto';
import { CreateBasketDto } from './dto/create-basket.dto';
import { UpdateBasketDto } from './dto/update-basket.dto';
import { Book } from '../books/entities/book.entity';

import { User } from '../user/entities/user.entity';
import { Basket } from './entities/basket.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Basket) private readonly basketRepo: Repository<Basket>,
  ) { }

  async create(createBasketDto: CreateBasketDto) {
    try {
      const { userId, bookIds, count } = createBasketDto;
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const books = await this.bookRepo.find({ where: { id: In(bookIds) } });
      const newBasket = this.basketRepo.create({ user, books, isPurchased: false, count });
      await this.basketRepo.save(newBasket);
      console.log("OK");
      return 'Basket created successfully';
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  async findAll(findAllBasketDto: FindAllBasketDto) {
    try {
      const totalPostCount = await this.basketRepo.count()
      const { page, limit } = findAllBasketDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const books = await this.basketRepo.find({
        take: limit,
        skip: pagination.offset,
      })
      return new ApiResponse(books, pagination)
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number) {
    try {
      const book = await this.basketRepo.findOneBy({ id })
      return book
    } catch (error) {
      throw error
    }
  }
  async update(id: number, updateBasketDto: UpdateBasketDto) {
    try {
      const { userId, bookIds, count } = updateBasketDto;
      const basket = await this.basketRepo.findOne({
        where: { id },
        relations: ['user', 'books'],
      });
      if (!basket) {
        throw new NotFoundException(`Basket with id ${id} not found`);
      }
      if (userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
          throw new NotFoundException(`User with id ${userId} not found`);
        }
        basket.user = user;
      }
      if (bookIds) {
        const books = await this.bookRepo.findByIds(bookIds);
        if (books.length !== bookIds.length) {
          throw new NotFoundException(`One or more books not found`);
        }
        basket.books = books;
      }
      basket.count = count;
      await this.basketRepo.save(basket);
      return 'Basket updated successfully';
    } catch (error) {
      throw error;
    }
  }
  async remove(id: number) {
    try {
      const user = await this.basketRepo.findOneBy({ id })
      if (!user) {
        throw new NotFoundException(`Basket wwith id: ${id} not found`)
      }
      this.basketRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}

