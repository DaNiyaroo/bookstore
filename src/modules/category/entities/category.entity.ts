import { RootEntity } from "src/common/entity/root.entity";
import { Book } from "src/modules/books/entities/book.entity";
import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

@Entity()
export class Category extends RootEntity {

    @Column()
    name: string;

    @ManyToMany(() => Book, book => book.categories)
    books: Book[];
}
