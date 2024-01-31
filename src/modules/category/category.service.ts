import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../books/entities/book.entity';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';
import { FindAllCategoryDto } from './dto/findAll-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>
  ) { }
  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const { name, bookIds } = createCategoryDto;
      const books = await this.bookRepo.find({ where: { id: In(bookIds) } });
      const notFoundBookIds = bookIds.filter((id) => !books.some((book) => book.id === id));
      if (notFoundBookIds.length > 0) {
        throw new NotFoundException(`Books with ids ${notFoundBookIds.join(', ')} not found`);
      }
      const createCategory = this.categoryRepo.create({ name, books });
      await this.categoryRepo.save(createCategory);
      return 'success';
    } catch (error) {
      throw error;
    }
  }
  async findAll(findAllCategoryDto: FindAllCategoryDto) {
    try {
      const totalPostCount = await this.categoryRepo.count()
      const { page, limit } = findAllCategoryDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const category = await this.categoryRepo.find({
        take: limit,
        skip: pagination.offset
      })
      return new ApiResponse(category, pagination)
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number) {
    try {
      const user = await this.categoryRepo.findOne({
        where: { id },
        relations: ['books' /* ... дополнительные связи */],
      });
      return user;
    } catch (error) {
      throw error;
    }
  }
  
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      const { name, bookIds } = updateCategoryDto;
      const books = await this.bookRepo.find({ where: { id: In(bookIds) } });
      const notFoundBookIds = bookIds.filter((id) => !books.some((book) => book.id === id));
      if (notFoundBookIds.length > 0) {
        throw new NotFoundException(`Books with ids ${notFoundBookIds.join(', ')} not found`);
      }
      const category = await this.categoryRepo
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.books', 'books')
        .where('category.id = :id', { id })
        .getOne();
      category.name = name;
      category.books = books;
      await this.categoryRepo.save(category);
      return 'success';
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async remove(id: number) {
    try {
      const category = await this.categoryRepo.findOneBy({ id })
      if (!category) {
        throw new NotFoundException(`User wwith id: ${id} not found`)
      }
      this.categoryRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}
