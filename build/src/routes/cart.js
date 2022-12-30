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
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const Cart_1 = require("../entity/Cart");
const CartItem_1 = require("../entity/CartItem");
const Product_1 = require("../entity/Product");
const User_1 = require("../entity/User");
const logger_1 = require("../services/logger");
exports.router = express_1.default.Router();
// add to cart particular product   
exports.router.post('/add', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, qty } = req.body;
    const { user } = req;
    const { orm } = req.locals;
    try {
        const product = yield orm.getRepository(Product_1.Product).findOne({ where: { id: pid } });
        const fetchedUser = yield orm.getRepository(User_1.User).findOne({ where: { id: user.id }, relations: {
                cart: true
            } });
        if (!product)
            throw new Error('Product not found');
        if (!fetchedUser)
            throw new Error('User not found');
        const cartRep = orm.getRepository(Cart_1.Cart);
        const cart = fetchedUser.cart;
        const cartItem = {
            product: product,
            quantity: qty,
            cart,
            cartId: cart.id,
            price: product.price * qty
        };
        // saving it along with cart doesn't work for reason that i don't know :(
        yield orm.getRepository(CartItem_1.CartItem).save(cartItem);
        cartRep.update({ id: cart.id }, { total: cart.total + cartItem.price });
        return res.status(200).json({ added: 'true' });
    }
    catch (error) {
        (0, logger_1.logger)(error);
        return res.status(400).json({ error: 'Something went wrong' });
    }
}));
// return all cart items
exports.router.get('/', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { orm } = req.locals;
    try {
        const cart = user.cart;
        const ucart = yield orm.getRepository(Cart_1.Cart).findOne({ where: { id: cart.id }, relations: ['cartItems', 'cartItems.product']
        });
        return res.status(200).json({ cart: ucart });
    }
    catch (error) {
        (0, logger_1.logger)(error);
        return res.status(400).json({ error: 'Something went wrong' });
    }
}));
// update the cart item qty
exports.router.post('/update', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { pid, qty } = req.body;
    const { user } = req;
    const { orm } = req.locals;
    const { cart } = user;
    try {
        const product = yield orm.getRepository(Product_1.Product).findOne({ where: { id: pid } });
        if (!product)
            throw new Error('Product not found');
        const cartItem = yield orm.getRepository(CartItem_1.CartItem).findOne({ where: { cartId: cart.id, productId: product.id } });
        if (!cartItem)
            throw new Error('Cart item not found');
        if (qty === 0) {
            yield orm.getRepository(CartItem_1.CartItem).delete({ cartId: cart.id, productId: product.id });
            cart.total -= cartItem.price;
        }
        else {
            cartItem.quantity = qty;
            cartItem.price = product.price * qty;
            yield orm.getRepository(CartItem_1.CartItem).save(cartItem);
        }
        return res.status(200).json({ updated: 'true' });
    }
    catch (error) {
        (0, logger_1.logger)(error);
        return res.status(400).json({ error: 'Something went wrong' });
    }
}));
// fetch cart item quantity
exports.router.get('/:pid', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { pid } = req.params;
    const { user } = req;
    const { orm } = req.locals;
    const { cart } = user;
    try {
        const product = yield orm.getRepository(Product_1.Product).findOne({ where: { id: pid } });
        if (!product)
            throw new Error('Product not found');
        const cartItem = yield orm.getRepository(CartItem_1.CartItem).findOne({ where: { cartId: cart.id, productId: product.id } });
        return res.status(200).json({ quantity: (_a = cartItem === null || cartItem === void 0 ? void 0 : cartItem.quantity) !== null && _a !== void 0 ? _a : 0 });
    }
    catch (error) {
        (0, logger_1.logger)(error);
        return res.status(400).json({ error: 'Something went wrong' });
    }
}));
