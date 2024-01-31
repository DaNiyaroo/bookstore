import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { Repository } from 'typeorm';
import { Book } from '../books/entities/book.entity';
import { FindAllReviewDto } from './dto/findAll-review.dto';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review) private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  async create(CreateReviewDto: CreateReviewDto) {
    try {
      const { userId, content, rating, bookId } = CreateReviewDto;
      const book = await this.bookRepo.findOne({ where: { id: bookId } });
      if (!book) {
        throw new NotFoundException(`Book with id ${bookId} not found`);
      }
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      if (rating < 1 || rating > 10) {
        throw new BadRequestException('Rating must be between 1 and 10');
      }
      const createReview = this.reviewRepo.create({ userId, content, rating, bookId });
      await this.reviewRepo.save(createReview);
      return "success";
    } catch (error) {
      throw error;
    }
  }
  async findAll(findAllReviewDto: FindAllReviewDto) {
    try {
      const totalPostCount = await this.reviewRepo.count()
      const { page, limit } = findAllReviewDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const reviews = await this.reviewRepo.find({
        take: limit,
        skip: pagination.offset
      })
      return new ApiResponse(reviews, pagination)
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number) {
    try {
      const review = await this.reviewRepo.findOneBy({ id })
      return review
    } catch (error) {
      throw error
    }
  }
  async update(id: number, UpdateReviewDto: UpdateReviewDto) {
    try {
      const { userId, content, rating, bookId } = UpdateReviewDto
      const books = await this.reviewRepo.findOneBy({ id })
      if (!books) {
        throw new NotFoundException(`Book with id ${id} not found`)
      }
      const bookreview = await this.bookRepo.findOne({ where: { id: bookId } })
      if (bookreview) {
        throw new NotFoundException(`Book with id ${bookId} not found`)
      }
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      this.reviewRepo.update({ id }, { userId, content, rating, bookId })
    } catch (error) {
      throw error
    }
  }
  async remove(id: number) {
    try {
      const bookreview = await this.reviewRepo.findOneBy({ id })
      if (!bookreview) {
        throw new NotFoundException(`User wwith id: ${id} not found`)
      }
      this.reviewRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}
