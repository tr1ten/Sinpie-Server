import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Relation,
  JoinTable,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  OneToMany,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { Cart } from "./Cart";
import { Product } from "./Product";
import { Review } from "./Review";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: "admin_s",
  })
  firstName: string;

  @Column({
    nullable: true,
  })
  lastName: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  email: string;

  @Column({
    type: "varchar",
    nullable: false,
  })
  password: string;
  @Column({
    default: 9,
  })
  age: number;

  @ManyToMany((type) => Product, (product) => product.favoriteUsers)
  @JoinTable()
  favoriteProducts: Relation<Product[]>;

  @OneToOne((type) => Cart, (cart) => cart.user,{cascade:true})
  @JoinColumn()
  cart: Cart;

  @OneToMany(() => Review, review => review.user)
  reviews: Relation<Review[]>;
}
