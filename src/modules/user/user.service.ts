import { FindAllUserDto } from './dto/findAll-user.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) { }
  async create(CreateUserDto: CreateUserDto) {
    try {
      const { username, firstname, lastname, email, phone, role, token, password } = CreateUserDto
      const user = await this.userRepo.findOneBy({ email })
      if (user) {
        throw new BadRequestException(`User with email ${email} already exist`)
      }
      const userWithUsername = await this.userRepo.findOneBy({ username })
      if (userWithUsername) {
        throw new BadRequestException(`User with email ${username} already exist`)
      }
      const createUser = this.userRepo.create({ username, firstname, lastname, password, email, phone, role, token })
      await this.userRepo.save(createUser)
      return "success"
    } catch (error) {
      throw error
    }
  }
  async findAll(findAllUserDto: FindAllUserDto) {
    try {
      const totalPostCount = await this.userRepo.count()
      const { page, limit } = findAllUserDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const posts = await this.userRepo.find({
        take: limit,
        skip: pagination.offset,

      })
      return new ApiResponse(posts, pagination)
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number) {
    try {
      const user = await this.userRepo.findOneBy({ id })
      return user
    } catch (error) {
      throw error
    }
  }
  async update(id: number, UpdateUserDto: UpdateUserDto) {
    try {
      const { username, firstname, lastname, email, phone, role, token } = UpdateUserDto
      const user = await this.userRepo.findOneBy({ id })
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`)
      }
      this.userRepo.update({ id }, { username, firstname, lastname, email, phone, role, token })
    } catch (error) {
      throw error
    }
  }
  async remove(id: number) {
    try {
      const user = await this.userRepo.findOneBy({ id })
      if (!user) {
        throw new NotFoundException(`User wwith id: ${id} not found`)
      }
      this.userRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}
