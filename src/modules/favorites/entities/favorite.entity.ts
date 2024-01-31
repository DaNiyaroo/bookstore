import { RootEntity } from "src/common/entity/root.entity";
import { Book } from "src/modules/books/entities/book.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from "typeorm";

@Entity()
export class Favorite extends RootEntity {

    @ManyToOne(() => User, (user) => user.favorites)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToMany(() => Book, { cascade: true })
    @JoinTable()
    books: Book[];
}
