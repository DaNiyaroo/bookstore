import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber } from "class-validator"
import { OrderStatus } from "../entities/order.entity";

export class CreateOrderDto {

    @IsNumber()
    @IsNotEmpty()
    userId: number;
  
    @IsArray()
    @ArrayMinSize(1, { message: 'At least one book must be provided' })
    bookIds: number[];
  
    @IsEnum(OrderStatus, { message: 'Invalid order status' })
    status: OrderStatus = OrderStatus.Pending;
    
}
