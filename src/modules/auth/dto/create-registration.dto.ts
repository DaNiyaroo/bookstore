import { IsEmail, IsNumber, IsOptional, IsString, IsStrongPassword, isStrongPassword } from "class-validator";

export class CreateRegistrationDto {

    @IsString()
    firstname: string;
  
    @IsString()
    lastname: string;
  
    @IsString()
    username: string;
  
    @IsStrongPassword()
    password: string;
  
    @IsNumber()
    phone: number;

}
