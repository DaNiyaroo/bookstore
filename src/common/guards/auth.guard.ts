import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {} 

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization.split(" ")[1]; 
    if (token) {
      const verifyOptions = {
        secret: process.env.ACCESS_TOKEN_SECRET,
      };

      const { userId, role } = this.jwtService.verify(token, verifyOptions); 
      request.user = { userId, role }; // Установка userId и role в объект запроса
      return true;
    }
  }
}