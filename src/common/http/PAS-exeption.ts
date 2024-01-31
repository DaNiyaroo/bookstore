import { HttpException, HttpStatus } from '@nestjs/common';

export class PaymentAlreadySuccessfulException extends HttpException {
  constructor(paymentId: number) {
    super(`Payment with ID ${paymentId} is already successful and cannot be updated`, HttpStatus.BAD_REQUEST);
  }
}
