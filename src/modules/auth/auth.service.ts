import { CreateOtpDto } from './dto/create-otp.dto';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { MailService } from './mail.service';
import { authenticator } from 'otplib';

import { env } from 'src/common/config/env.config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from 'src/common/enum/user-role.enum';
import * as bcrypt from 'bcrypt';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { LoginDto } from './dto/create-login.dto';

@Injectable()
export class AuthService {
  private otpCache: Record<string, string> = {};
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly emailService: MailService,
    private readonly jwtService: JwtService,
  ) { }

  async sendOtp(createOtpDto: CreateOtpDto): Promise<{ message: string }> {
    try {
      const { email } = createOtpDto;
      const user = await this.userRepo.findOneBy({ email });

      if (user) {
        throw new NotFoundException(`User with email ${email} already exists`);
      }

      const secret = authenticator.generateSecret();
      const otp = authenticator.generate(secret);

      // Сохранение OTP во временном хранилище (в данном случае, кэше)
      this.otpCache[email] = otp;

      // Отправка электронного письма с OTP
      await this.emailService.sendOtpEmail(email, otp);

      return { message: 'OTP sent. Please check your email for the code.' };
    } catch (error) {
      console.error('Error in sendOtp:', error);
    }
  }


  async verifyOtp(email: string, otp: string): Promise<User | { accessToken: string; refreshToken: string; message: string } | null> {
    try {
      // Получение OTP из временного хранилища
      const storedOtp = this.otpCache[email];
      // Проверка, что OTP существует и совпадает с введенным значением
      if (!storedOtp || storedOtp !== otp) {
        throw new NotFoundException('Invalid OTP');
      }
      // Создание нового пользователя в базе данных
      const newUser = new User();
      newUser.email = email;  // Добавление электронной почты пользователя
      // Сохранение пользователя в базе данных
      const savedUser = await this.userRepo.save(newUser);
      // Опционально: Удаление OTP из временного хранилища
      delete this.otpCache[email];

      const accessToken = this.jwtService.sign(
        { userId: savedUser.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
      );
      const refreshToken = this.jwtService.sign(
        { userId: savedUser.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '7d' },
      );
      savedUser.token = refreshToken;
      await this.userRepo.save(savedUser);
      return { accessToken, refreshToken, message: 'Verification successful' };
    } catch (error) {
      console.error('Error in verifyOtp:', error);
      throw error;
    }
  }

  async completeRegistration(userId: number, createRegistrationDto: CreateRegistrationDto): Promise<{ accessToken: string; refreshToken: string } | User> {
    try {
      const { firstname, lastname, username, password, phone } = createRegistrationDto;
      const user = await this.userRepo.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const existingUser = await this.userRepo.findOne({ where: { username } });

      if (existingUser) {
        throw new BadRequestException('Username already exists');
      }

      user.firstname = firstname;
      user.lastname = lastname;
      user.username = username;
      user.password = await bcrypt.hash(password, 10); // Хеширование пароля
      user.phone = phone;

      const updatedUser = await this.userRepo.save(user);

      await this.userRepo.save(updatedUser);

      const accessToken = this.jwtService.sign(
        { userId: updatedUser.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '1h' },
      );

      const refreshToken = this.jwtService.sign(
        { userId: updatedUser.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '7d' },
      );

      updatedUser.token = refreshToken; // Предположим, что у вашей сущности есть столбец token

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error in completeRegistration:', error);
      throw error;
    }
  }


  async login(loginDto: LoginDto): Promise<{ accessToken: string; refreshToken: string } | User> {
    try {
      const { usernameOrEmail, password } = loginDto;
      const user = await this.userRepo.findOne({
        where: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid password');
      }
      const accessToken = this.jwtService.sign(
        { userId: user.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '1d' },
      );
      const refreshToken = this.jwtService.sign(
        { userId: user.id, role: UserRole.User },
        { secret: env.ACCESS_TOKEN_SECRET, expiresIn: '7d' },
      );
      user.token = refreshToken;
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error in login:', error);
      throw error;
    }
  }
}
