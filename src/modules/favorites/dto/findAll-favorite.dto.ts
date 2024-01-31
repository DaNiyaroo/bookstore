import { Type } from "class-transformer"
import { IsInt, IsNumber, IsOptional } from "class-validator"

export class FindAllFavoriteDto {

    @IsNumber({maxDecimalPlaces: 0})
    @IsOptional()
    @Type(() => Number)
    page: number

    @IsNumber({maxDecimalPlaces: 0})
    @IsOptional()
    @Type(() => Number)
    limit: number
}