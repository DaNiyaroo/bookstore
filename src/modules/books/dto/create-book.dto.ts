import { IsBoolean, IsNumber, IsString, IsUrl } from "class-validator";

export class CreateBookDto {

    @IsString()
    name: string

    @IsString()
    description: string

    @IsString()
    author: string

    @IsNumber()
    price: number

    @IsBoolean()
    available: boolean

    @IsUrl()
    coverImage: string


}
