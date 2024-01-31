import { IsNumber, IsString } from "class-validator";

export class CreateAddressDto {

    @IsString()
    country: string

    @IsString()
    city: string

    @IsString()
    street: string

    @IsString()
    house: string

    @IsString()
    zipCode: string

    @IsNumber()
    userId: number;
}
