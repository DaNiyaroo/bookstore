import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional } from "class-validator";

export class FindAllAddressDto {

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    page: number;

    @IsInt()
    @IsOptional()
    @Type(() => Number)
    limit: number;
}
