// this is cart entity

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable, Relation } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";
import { CartItem } from "./CartItem";

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number

    @OneToOne(type => User, user => user.cart)
    user: User

    @Column({
        default:0
    })
    total: number

    @OneToMany(type=>CartItem, cartItem => cartItem.cart,{
        cascade: true,
        eager: true
    })
    cartItems: Relation<CartItem[]>
}