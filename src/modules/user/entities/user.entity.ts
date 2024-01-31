import { Payment } from './../../payment/entities/payment.entity';
import { RootEntity } from "src/common/entity/root.entity";
import { UserRole } from 'src/common/enum/user-role.enum';
import { Address } from 'src/modules/address/entities/address.entity';
import { Basket } from 'src/modules/basket/entities/basket.entity';
import { Favorite } from 'src/modules/favorites/entities/favorite.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";

@Entity()
export class User extends RootEntity {

    @Column({ nullable: true })
    username: string

    @Column({ nullable: true })
    firstname: string

    @Column({ nullable: true })
    lastname: string

    @Column({ nullable: true })
    phone: number

    @Column({ unique: true })
    email: string

    @Column({ enum: UserRole, type: 'enum', default: UserRole.User })
    role: UserRole

    @Column({ nullable: true })
    password: string

    @Column({ nullable: true })
    token: string

    @OneToMany(() => Favorite, (favorite) => favorite.user)
    favorites: Favorite[];

    @OneToMany(() => Basket, (basket) => basket.user)
    baskets: Basket[];

    @OneToOne(() => Address, (address) => address.user)
    @JoinColumn()
    address: Address;

    @OneToMany(() => Order, (order) => order.user)
    orders: Order[];

    @OneToMany(() => Payment, (payment) => payment.user)
    payments: Payment[];
    
    @Column({ nullable: true })
    otpSecret: string;
  
    @Column({ nullable: true })
    otp: string;
}
