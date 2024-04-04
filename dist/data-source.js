"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_OPTIONS = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const AnimeCategory_1 = require("./entity/AnimeCategory");
const Cart_1 = require("./entity/Cart");
const CartItem_1 = require("./entity/CartItem");
const Order_1 = require("./entity/Order");
const Product_1 = require("./entity/Product");
const ProductCategory_1 = require("./entity/ProductCategory");
const User_1 = require("./entity/User");
const UserSubscriber_1 = require("./entity/UserSubscriber");
require("dotenv").config();
// environment variables
const env = process.env;
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: env.SQL_HOST,
    port: parseInt(env.SQL_PORT),
    username: env.SQL_USER,
    password: env.SQL_PASSWORD,
    database: env.SQL_DATABASE || "sinpie",
    synchronize: false,
    dropSchema: false,
    logging: false,
    entities: [User_1.User, Product_1.Product, ProductCategory_1.ProductCategory, AnimeCategory_1.AnimeCategory, Cart_1.Cart, CartItem_1.CartItem, Order_1.Order],
    migrations: [],
    subscribers: [UserSubscriber_1.UserSubscriber]
});
exports.DB_OPTIONS = {
    host: env.SQL_HOST,
    port: env.SQL_PORT,
    user: env.SQL_USER,
    password: env.SQL_PASSWORD,
    database: 'sinpie'
};
//# sourceMappingURL=data-source.js.map