import "reflect-metadata"
import { DataSource } from "typeorm"
import { AnimeCategory } from "./entity/AnimeCategory"
import { Cart } from "./entity/Cart"
import { CartItem } from "./entity/CartItem"
import { Order } from "./entity/Order"
import { Product } from "./entity/Product"
import { ProductCategory } from "./entity/ProductCategory"
import { User } from "./entity/User"
import { UserSubscriber } from "./entity/UserSubscriber"
require("dotenv").config()
// environment variables
const env = process.env

export const AppDataSource = new DataSource({
    type: "postgres",
    host:  env.SQL_HOST,
    port: parseInt(env.SQL_PORT),
    username:  env.SQL_USER,
    password: env.SQL_PASSWORD,
    database:  env.SQL_DATABASE || "sinpie" ,
    synchronize: false,
    dropSchema: false,
    logging: false,
    entities: [User, Product, ProductCategory, AnimeCategory,Cart,CartItem,Order],
    migrations: [],
    subscribers: [UserSubscriber]
})
export const DB_OPTIONS = {
	host: env.SQL_HOST,
	port:   env.SQL_PORT,
	user: env.SQL_USER,
	password: env.SQL_PASSWORD,
	database: 'sinpie'
};