import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Repository } from 'typeorm';
import { FindAllBookDto } from './dto/findAll-book.dto';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private readonly booksRepo: Repository<Book>,
  ) { }
  async create(CreateBookDto: CreateBookDto) {
    try {
      const { name, description, author, price, available, coverImage } = CreateBookDto
      const createBook = this.booksRepo.create({ name, description, author, price, available, coverImage })
      await this.booksRepo.save(createBook)
      return "success"
    } catch (error) {
      throw error
    }
  }

  async findAll(findAllBookDto: FindAllBookDto) {
    try {
      const totalPostCount = await this.booksRepo.count()
      const { page, limit } = findAllBookDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const books = await this.booksRepo.find({
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
      const book = await this.booksRepo.findOneBy({ id })
      return book
    } catch (error) {
      throw error
    }
  }

  async update(id: number, UpdateBookDto: UpdateBookDto) {
    try {
      const { name, description, author, price, available, coverImage } = UpdateBookDto
      const book = await this.booksRepo.findOneBy({ id })
      if (!book) {
        throw new NotFoundException(`Book with id ${id} not found`)
      }
      this.booksRepo.update({ id }, { name, description, author, price, available, coverImage })
    } catch (error) {
      throw error
    }
  }

  async remove(id: number) {
    try {
      const user = await this.booksRepo.findOneBy({ id })
      if (!user) {
        throw new NotFoundException(`Book wwith id: ${id} not found`)
      }
      this.booksRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}
