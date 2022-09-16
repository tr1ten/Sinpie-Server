import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, Relation, JoinTable } from "typeorm"
import { Product } from "./Product"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: "admin_s"
    })
    firstName: string

    @Column({
        nullable: true
    })
    lastName: string

    @Column({
        type: "varchar",
        nullable: false
    })
    email:string

    @Column(
        {
            type: "varchar",
            nullable: false
        }
    )
    password: string
    @Column({
        default:9
    })
    age: number

    @ManyToMany(type => Product, product => product.favoriteUsers,{
        onDelete: "CASCADE"
    })
    @JoinTable()
    favoriteProducts: Relation<Product[]>

}
