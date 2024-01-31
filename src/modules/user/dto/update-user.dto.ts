import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/common/enum/user-role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsString()
    username: string

    @IsString()
    firstname: string

    @IsString()
    @IsOptional()
    lastname: string

    @IsNumber()
    @IsOptional()
    phone: number

    @IsEmail()
    email: string

    @IsEnum(UserRole)
    role: UserRole

    @IsString()
    token: string
}
