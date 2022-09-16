import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Product } from "./Product";

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    label: string

    @OneToMany(type => Product, product => product.productCategory)
    products: Relation<Product[]>

}