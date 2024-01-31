import { IsNumber, IsString } from "class-validator";

export class CreateReviewDto {

    @IsNumber()
    userId: number

    @IsString()
    content: string

    @IsNumber()
    rating: number

    @IsNumber()
    bookId: number
}
