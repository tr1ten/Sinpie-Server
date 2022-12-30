"use strict";
// route for recieving fake orders then send to client mail using nodemailer
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
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const CartItem_1 = require("../entity/CartItem");
const Order_1 = require("../entity/Order");
const logger_1 = require("../services/logger");
const mailer_1 = require("../services/mailer");
exports.router = (0, express_1.Router)();
// this route will order the cart of the user
exports.router.post("/", passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    const { orm } = req.locals;
    try {
        let order = new Order_1.Order();
        order.cart = user.cart;
        order.totalPrice = user.cart.total;
        order.totalQuantity = 1;
        const orderRep = orm.getRepository(Order_1.Order);
        // clear cart items
        const cart = user.cart;
        // delete all cartitems
        yield orm.getRepository(CartItem_1.CartItem).delete({ cartId: cart.id });
        order = yield orderRep.save(order);
        const formattedHtml = `
        <h1>Order Recieved</h1>
        <h2>Order Details</h2>
        <p>Order Id: ${order.id}</p>
        <p>Order Date: ${order.createdAt}</p>
        <p>Order Total Price: ${order.totalPrice}</p>
        <p>Order Total Quantity: ${order.totalQuantity}</p>
        <h2>Order Items</h2>
        <ul>
        ${order.cart.cartItems.map(item => `<li>${item.product.label} - ${item.price}</li>`).join("")}`;
        (0, mailer_1.mailOrder)("Order Recieved from Sinpie ~", formattedHtml, user.email);
        res.status(200).json({ order: true });
    }
    catch (err) {
        (0, logger_1.logger)(err);
        return res.status(500).send({ order: false });
    }
}));
//# sourceMappingURL=order.js.map