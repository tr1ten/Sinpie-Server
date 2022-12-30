"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const index_1 = require("../index");
const AnimeCategory_1 = require("../entity/AnimeCategory");
const Product_1 = require("../entity/Product");
const ProductCategory_1 = require("../entity/ProductCategory");
const User_1 = require("../entity/User");
const logger_1 = require("../services/logger");
exports.router = express_1.default.Router();
exports.router.get('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { pcat, acat, size, filterBy, sortBy } = req.query;
    const whereCluase = {
        productCategory: {
            slug: pcat
        },
        animeCategory: {
            slug: acat
        }
    };
    if (!pcat) {
        delete whereCluase.productCategory;
    }
    if (!acat) {
        delete whereCluase.animeCategory;
    }
    const orderBy = {};
    switch (sortBy) {
        case 'price-low':
            orderBy.price = 'ASC';
            break;
        case 'price-high':
            orderBy.price = 'DESC';
        default:
            break;
    }
    const { orm } = req.locals;
    const allProds = yield orm.getRepository(Product_1.Product).find({ where: whereCluase, take: size !== null && size !== void 0 ? size : 10, order: orderBy, relations: {
            animeCategory: true,
            productCategory: true
        } });
    if (filterBy) {
        // for now just shuffle the array
        allProds.sort(() => Math.random() - 0.5);
    }
    // add isFav to each product
    const user = yield orm.getRepository(User_1.User).findOne({ where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }, relations: {
            favoriteProducts: true
        } });
    let newProds = allProds;
    if (user) {
        newProds = allProds.map(prod => {
            const np = prod;
            np.isFav = user.favoriteProducts.some(fav => fav.id === prod.id);
            return np;
        });
    }
    return res.status(200).json({ products: newProds });
}));
exports.router.get("/animeCats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const animeCategories = yield req.locals.orm.getRepository(AnimeCategory_1.AnimeCategory).find();
    return res.status(200).json({ animeCategories });
}));
exports.router.get("/productCats", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productCategories = yield req.locals.orm.getRepository(ProductCategory_1.ProductCategory).find();
    return res.status(200).json({ productCategories });
}));
// toggles the like of a product
exports.router.post('/:pid/favorite', (0, cors_1.default)(index_1.corsOptions), passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pid } = req.params;
        const user = req.user;
        const product = yield req.locals.orm.getRepository(Product_1.Product).findOne({ where: { id: pid } });
        const fetchedUser = yield req.locals.orm.getRepository(User_1.User).findOne({ where: { id: user.id }, relations: {
                favoriteProducts: true,
                cart: true
            } });
        if (!product)
            throw new Error('Product not found');
        const p = fetchedUser.favoriteProducts.find((product) => product.id === pid);
        if (p) {
            fetchedUser.favoriteProducts = fetchedUser.favoriteProducts.filter((product) => product.id !== pid);
        }
        else {
            fetchedUser.favoriteProducts.push(product);
        }
        yield req.locals.orm.getRepository(User_1.User).save(fetchedUser);
        return res.status(200).json({ favorite: !Boolean(p) });
    }
    catch (e) {
        (0, logger_1.logger)(e);
        return res.status(400).json({ error: e.message });
    }
}));
// get fav of a product
exports.router.get('/:pid/favorite', (0, cors_1.default)(index_1.corsOptions), passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const { pid } = req.params;
        const user = req.user;
        const product = yield req.locals.orm.getRepository(Product_1.Product).findOne({ where: { id: pid } });
        const fetchedUser = yield req.locals.orm.getRepository(User_1.User).findOne({ where: { id: user.id }, relations: {
                favoriteProducts: true
            } });
        if (!product)
            throw new Error('Product not found');
        if (!fetchedUser)
            throw new Error('User not found');
        const isFav = (_b = fetchedUser.favoriteProducts) === null || _b === void 0 ? void 0 : _b.find((fav) => fav.id === product.id);
        return res.status(200).json({ favorite: Boolean(isFav) });
    }
    catch (e) {
        console.log("Error during favorite get", e);
        return res.status(400).json({ error: e.message });
    }
}));
// fetch product details
exports.router.get('/product/:pid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pid } = req.params;
        const product = yield req.locals.orm.getRepository(Product_1.Product).findOne({ where: { id: pid }, relations: {
                productCategory: true,
            } });
        if (!product)
            throw new Error('Product not found');
        return res.status(200).json({ product });
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
}));
//# sourceMappingURL=product.js.map