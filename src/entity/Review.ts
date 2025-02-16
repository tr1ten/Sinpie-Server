import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Relation } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity()
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => User, user => user.reviews)
    user: Relation<User>;

    @ManyToOne(() => Product, product => product.reviews)
    product: Relation<Product>;

    @Column()
    comment: string;

    @Column("float")
    rating: number;

    @Column("simple-array", { nullable: true })
    images: string[];

    @CreateDateColumn()
    createdAt: Date;
} 