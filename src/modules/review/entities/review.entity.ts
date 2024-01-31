import { IsInt, Max, Min } from 'class-validator';
import { RootEntity } from 'src/common/entity/root.entity';
import { Book } from 'src/modules/books/entities/book.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';


@Entity()
export class Review extends RootEntity {
 
    @Column()
    userId: number; // Имя пользователя, оставившего отзыв

    @Column({ type: 'text' })
    content: string; // Текст отзыва

    @Column({ type: 'smallint' })
    @IsInt()
    @Min(1)
    @Max(10)
    rating: number; // Рейтинг отзыва (например, от 1 до 5)

    @ManyToOne(() => Book, book => book.reviews)
    @JoinColumn({ name: 'bookId' })
    book: Book; // Связь между отзывом и книгой

    @Column()
    bookId: number; // Внешний ключ книги
}
