import { Payment } from './../../payment/entities/payment.entity';
import { RootEntity } from "src/common/entity/root.entity";
import { Book } from "src/modules/books/entities/book.entity";
import { User } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";

export enum OrderStatus {
    Pending = 'pending',
    Shipped = 'shipped',
    Delivered = 'delivered',
}

@Entity()
export class Order extends RootEntity {
    @ManyToOne(() => User, (user) => user.orders)
    @JoinTable() 
    user: User;

    @ManyToMany(() => Book, (book) => book.orders)
    @JoinTable()
    books: Book[];

    @Column({ default: false })
    isConfirmed: boolean;

    @Column({ nullable: true })
    confirmationDate: Date;

    @Column({ default: 0 })
    totalAmount: number;

    @OneToMany(() => Payment, (payment) => payment.order)
    payment: Payment[]

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
    status: OrderStatus;

}