import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { titleToSlug } from "../helpers/util";
import { Product } from "./Product";

@Entity()
export class ProductCategory {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    label: string

    @OneToMany(type => Product, product => product.productCategory)
    products: Relation<Product[]>
    
    @Column({
        default: "",
    })
    slug: string
    // trigger that will generate slug value when new row is inserted 
    @BeforeInsert()
    sluggifyTitles() {
        this.slug = titleToSlug(this.label);
    }

}