// this is cartitem entity

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable, PrimaryColumn, Relation, Index } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
@Index(["cartId", "productId"], { unique: true })
export class CartItem {
    @PrimaryColumn()
    cartId: number

    @ManyToOne(type => Cart, cart => cart.cartItems,{
        onDelete: "CASCADE"
    })
    @JoinColumn()
    cart: Relation<Cart>

    @Column()
    price: number

    @Column()
    quantity: number

    @PrimaryColumn()
    productId: string

    @ManyToOne(type => Product,{eager:true})
    product: Relation<Product>

}