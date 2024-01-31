import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";
import { env } from "./env.config";
import { User } from "src/modules/user/entities/user.entity";
import { Book } from "src/modules/books/entities/book.entity";
import { Review } from "src/modules/review/entities/review.entity";
import { Category } from "src/modules/category/entities/category.entity";
import { Favorite } from "src/modules/favorites/entities/favorite.entity";
import { Basket } from "src/modules/basket/entities/basket.entity";
import { Address } from "src/modules/address/entities/address.entity";
import { Order } from "src/modules/order/entities/order.entity";
import { Payment } from "src/modules/payment/entities/payment.entity";

export const typeormConfig: MysqlConnectionOptions = {
    type: 'mysql',
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASS,
      database: env.DB_NAME,
      entities: [User, Book, Review, Category, Favorite, Basket, Address, Order, Payment],
      synchronize: true,
 
}