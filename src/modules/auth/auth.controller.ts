import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateOtpDto } from './dto/create-otp.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dto/create-login.dto';
import { error } from 'console';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('send-otp')
  async sendOtp(@Body() createOtpDto: CreateOtpDto): Promise<{ message: string }> {
    try {
      const result = await this.authService.sendOtp(createOtpDto);
      return result; // Возвращайте результат, полученный от authService.sendOtp
    } catch (error) {
      console.error('Error in sendOtp:', error);
      throw error;
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    const result = await this.authService.verifyOtp(email, otp);
    if ('accessToken' in result && 'refreshToken' in result) {
      // Верификация прошла успешно, возвращаем токены
      return result;
    } else {
      throw error
    }
  }

  @Post('complete-registration')
  @UseGuards(AuthGuard)
  async completeRegistration(@Body() createAuthDto: CreateAuthDto, @Req() req: any): Promise<{ accessToken: string; refreshToken: string; message: string } | User> {
    const userId = req.user.userId;
    const result = await this.authService.completeRegistration(userId, createAuthDto);
    if ('accessToken' in result && 'refreshToken' in result) {
      // Регистрация успешна, возвращаем токены и сообщение
      return { ...result, message: 'Registration successful' };
    } else {
      return result;
    }
  }
  
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return result;
    } catch (error) {
      throw error;
    }
  }
}