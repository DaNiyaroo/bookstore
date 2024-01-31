
import { RootEntity } from 'src/common/entity/root.entity';
import { Basket } from 'src/modules/basket/entities/basket.entity';
import { Category } from 'src/modules/category/entities/category.entity';
import { Favorite } from 'src/modules/favorites/entities/favorite.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Review } from 'src/modules/review/entities/review.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany } from "typeorm";

@Entity()
export class Book extends RootEntity {

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    author: string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    price: number;

    @Column({ default: true })
    available: boolean;

    @Column({ nullable: true })
    coverImage: string;

    @OneToMany(() => Review, review => review.book)
    reviews: Review[];

    @ManyToMany(() => Category, category => category.books)
    @JoinTable()
    categories: Category[];

    @ManyToMany(() => Favorite, (favorite) => favorite.books)
    favorites: Favorite[];

    @ManyToMany(() => Basket, (basket) => basket.books, { cascade: true })
    @JoinTable()
    baskets: Basket[];

    @ManyToMany(() => Order, (order) => order.books)
    orders: Order[];
}
