import { IsBoolean, IsDate, IsNumber } from "class-validator";

export class CreatePaymentDto {
 
    @IsNumber()
    userId: number;
    
    @IsNumber()
    orderId: number;
}
