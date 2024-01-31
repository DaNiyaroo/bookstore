import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { env } from 'src/common/config/env.config';

@Injectable()
export class MailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    // Настройка транспорта для отправки электронной почты (например, SMTP)
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Замените на свой SMTP-хост
      port: 587, // Порт вашего SMTP-сервера
      secure: false, // Устанавливается на true, если используется SSL/TLS
      auth: {
        user: env.USER, // Ваша почта
        pass: "wbgd mtxk xuje tozr", // Ваш пароль
      },
    });
  }
  
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    // Отправка электронного письма с OTP
    await this.transporter.sendMail({
      from: env.USER, // Ваша почта
      to: email,
      subject: 'Your OTP for Registration',
      text: `Your OTP is: ${otp}`,
    });
  }
}
