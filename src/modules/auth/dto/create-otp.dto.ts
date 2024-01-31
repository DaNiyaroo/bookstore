import { IsEmail, IsNumber, IsString } from "class-validator";

export class CreateOtpDto {

    @IsEmail()
    email: string;
}
