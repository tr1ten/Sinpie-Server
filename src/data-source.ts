import "reflect-metadata"
import { DataSource } from "typeorm"
import { AnimeCategory } from "./entity/AnimeCategory"
import { Product } from "./entity/Product"
import { ProductCategory } from "./entity/ProductCategory"
import { User } from "./entity/User"
require("dotenv").config()
// environment variables
const env = process.env
export const AppDataSource = new DataSource({
    type: "mysql",
    host:  env.MYSQL_HOST,
    port: parseInt(env.MYSQL_PORT),
    username:  env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: "sinpie",
    synchronize: true,
    logging: false,
    entities: [User, Product, ProductCategory, AnimeCategory],
    migrations: [],
    subscribers: [],
})
