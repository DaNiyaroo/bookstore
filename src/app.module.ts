import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './common/config/typeorm.config';
import { CategoryModule } from './modules/category/category.module';
import { AddressModule } from './modules/address/address.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { BasketModule } from './modules/basket/basket.module';
import { BooksModule } from './modules/books/books.module';
import { ReviewModule } from './modules/review/review.module';
import { OrderModule } from './modules/order/order.module';
import { PaymentModule } from './modules/payment/payment.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), UserModule, CategoryModule, AddressModule, FavoritesModule, BasketModule, BooksModule, ReviewModule, OrderModule, PaymentModule, AuthModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
