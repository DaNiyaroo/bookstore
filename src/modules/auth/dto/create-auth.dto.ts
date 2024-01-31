import { IsEmail, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthDto {

    @IsString()
    firstname: string;

    @IsString()
    lastname: string;
  
    @IsString()
    username: string;
  
    @IsString()
    password: string;

    @IsNumber()
    phone: number;

}
