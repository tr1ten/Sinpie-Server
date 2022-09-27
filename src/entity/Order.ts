// this is order entity

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable, Relation, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Cart } from "./Cart";

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        default: 0
    })
    totalPrice: number

    @Column({
        default: 0
    })
    totalQuantity: number

    @ManyToOne(type => Cart,{
        onDelete:'CASCADE'
    })
    cart: Cart

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}