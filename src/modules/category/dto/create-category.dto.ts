import { ArrayMinSize, IsArray, IsString } from "class-validator";
import { Book } from "src/modules/books/entities/book.entity";

export class CreateCategoryDto {

    @IsString()
    name: string

    @IsArray()
    @ArrayMinSize(1, { message: 'At least one bookId is required' })
    bookIds: number[]; 
}
