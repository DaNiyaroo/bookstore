import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { In, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Book } from '../books/entities/book.entity';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';
import { FindAllFavoriteDto } from './dto/findAll-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite) private readonly favoriteRepo: Repository<Favorite>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
  ) { }
  async create(createFavoriteDto: CreateFavoriteDto): Promise<string> {
    try {
      const { userId, bookId } = createFavoriteDto;
      const book = await this.bookRepo.findOne({ where: { id: bookId } });
      if (!book) {
        throw new NotFoundException(`Book with id ${bookId} not found`);
      }
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const favorite = await this.favoriteRepo
        .createQueryBuilder('favorite')
        .leftJoinAndSelect('favorite.books', 'books')
        .where('favorite.user = :userId', { userId })
        .getOne();
      const isBookAlreadyInFavorite = favorite && favorite.books.some((book) => book.id === bookId);
      if (!isBookAlreadyInFavorite) {
        const newFavorite = this.favoriteRepo.create({ user, books: [book] });
        await this.favoriteRepo.save(newFavorite);
        return 'Book added to favorites successfully';
      } else {
        return 'Book is already in favorites';
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async findAll(findAllFavoriteDto: FindAllFavoriteDto) {
    try {
      const totalPostCount = await this.favoriteRepo.count()
      const { page, limit } = findAllFavoriteDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const favorite = await this.favoriteRepo.find({
        take: limit,
        skip: pagination.offset
      })
      return new ApiResponse(favorite, pagination)
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number) {
    try {
      const favorite = await this.favoriteRepo.findOneBy({ id })
      return favorite
    } catch (error) {
      throw error
    }
  }
  async update(id: number, updateFavoriteDto: UpdateFavoriteDto): Promise<string> {
    try {
      const { userId, bookId } = updateFavoriteDto;
      const books = await this.bookRepo.find({ where: { id: In([bookId]) } });
      if (books.length !== 1) {
        throw new NotFoundException(`Book with id ${bookId} not found`);
      }
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const favorite = await this.favoriteRepo
        .createQueryBuilder('favorite')
        .leftJoinAndSelect('favorite.books', 'books')
        .where('favorite.id = :id', { id })
        .getOne();
      if (!favorite) {
        throw new NotFoundException(`Favorite with id ${id} not found`);
      }
      const isBookAlreadyInFavorite = favorite.books.some((book) => book.id === bookId);
      if (!isBookAlreadyInFavorite) {
        favorite.user = user;
        favorite.books.push({ id: bookId } as Book);
        await this.favoriteRepo.save(favorite);
        return 'Favorite updated successfully';
      } else {
        return 'Book is already in the favorite list';
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  async remove(id: number) {
    try {
      const favorite = await this.favoriteRepo.findOneBy({ id })
      if (!favorite) {
        throw new NotFoundException(`Favorite wwith id: ${id} not found`)
      }
      this.favoriteRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}
