import { ApiProperty } from "@nestjs/swagger"
import { ArrayNotEmpty, IsArray, IsEmail, IsEnum, IsInt, IsNumber, IsOptional, IsString, IsStrongPassword, isString } from "class-validator"
import { UserRole } from "src/common/enum/user-role.enum"

export class CreateUserDto {


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

    @IsStrongPassword()
    password: string

    @IsEmail()
    email: string

    @IsEnum(UserRole)
    role: UserRole

    @IsString()
    token: string
}
