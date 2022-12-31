import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { AnimeCategory } from "./AnimeCategory";
import { CartItem } from "./CartItem";
import { ProductCategory } from "./ProductCategory";
import { User } from "./User";

@Entity()
export class Product {
    
        @PrimaryGeneratedColumn("uuid")
        id: string
    
        @Column()
        label: string
    
        @Column()
        price: number

        @Column({
            default: 0
        })
        rating: number
    
        @Column({type:"varchar",length: 3000})
        description: string
        

        @Column({
            default:"https://www.comicsense.in"
        })
        shopUrl: string
    
        @Column({default: "https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg"})
        image: string

        @ManyToOne(type => ProductCategory, category => category.products, {
            cascade: true,
            onDelete: "CASCADE"
        })
        productCategory: Relation<ProductCategory>

        @ManyToOne(type => AnimeCategory, category => category.products,{
            cascade: true,
            onDelete: "CASCADE"
        })
        animeCategory: Relation<AnimeCategory>

        @ManyToMany(type => User, user => user.favoriteProducts)
        favoriteUsers: Relation<User[]>
    }