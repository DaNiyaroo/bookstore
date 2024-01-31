import { RootEntity } from "src/common/entity/root.entity";
import { Book } from "src/modules/books/entities/book.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Basket extends RootEntity {
  @ManyToOne(() => User, (user) => user.baskets)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Book, (book)=> book.baskets)
  books: Book[];

  @Column({ default: false })
  isPurchased: boolean;

  @Column({ nullable: true })
  purchaseDate: Date;

  @Column({ default: 0 })
  count: number;
}
