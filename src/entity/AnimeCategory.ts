import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Product } from "./Product";

@Entity()
export class AnimeCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    label: string

    @Column({
        nullable: true
    })
    image: string

    @OneToMany(type => Product, product => product.animeCategory)
    products: Relation<Product>
}