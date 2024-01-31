import { FindAllAddressDto } from './dto/findAll-address.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Pagination } from 'src/common/utils/pagination';
import { ApiResponse } from 'src/common/http/ApiResponse';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Address) private readonly addressRepo: Repository<Address>,
  ) { }
  async create(createAddressDto: CreateAddressDto) {
    try {
      const { userId, country, city, street, house, zipCode } = createAddressDto;
      const existingAddress = await this.addressRepo.findOne({
        where: { user: { id: userId } },
      });
      if (existingAddress) {
        throw new BadRequestException(`User with ID ${userId} already has an address`);
      }
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      const address = this.addressRepo.create({ user, country, city, street, house, zipCode });
      await this.addressRepo.save(address);
      return 'Address created successfully';
    } catch (error) {
      throw error;
    }
  }
  async findAll(findAllAddressDto: FindAllAddressDto) {
    try {
      const totalPostCount = await this.addressRepo.count()
      const { page, limit } = findAllAddressDto
      const pagination = new Pagination(limit, page, totalPostCount)
      const address = await this.addressRepo.find({
        take: limit,
        skip: pagination.offset,
      })
      return new ApiResponse(address, pagination)
    } catch (error) {
      throw error
    }
  }
  async findOne(id: number) {
    try {
      const address = await this.addressRepo.findOneBy({ id })
      return address
    } catch (error) {
      throw error
    }
  }
  async update(id: number, updateAddressDto: UpdateAddressDto) {
    try {
      const { userId, country, city, street, house, zipCode } = updateAddressDto
      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      this.addressRepo.update({ id }, { user, country, city, street, house, zipCode })
      return "Address updated successfully"
    } catch (error) {
      throw error
    }
  }
  async remove(id: number) {
    try {
      const address = await this.addressRepo.findOneBy({ id })
      if (!address) {
        throw new NotFoundException(`Basket wwith id: ${id} not found`)
      }
      this.addressRepo.delete({ id })
    } catch (error) {
      throw error
    }
  }
}
