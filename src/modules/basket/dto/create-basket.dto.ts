import { ArrayMinSize, ArrayUnique, IsArray, IsNumber, IsPositive } from 'class-validator';


export class CreateBasketDto {
  @IsNumber()
  userId: number;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  bookIds: number[];

  @IsNumber()
  count: number;
}
