import { str } from 'envalid';
import { RootEntity } from "src/common/entity/root.entity";
import { User } from 'src/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
@Entity()
export class Address extends RootEntity {

    @Column()
    country: string;

    @Column()
    city: string;

    @Column()
    street: string;

    @Column()
    house: string

    @Column()
    zipCode: string;

    @OneToOne(() => User, (user) => user.address)
    @JoinColumn()
    user: User;

}
