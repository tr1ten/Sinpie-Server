"use strict";
// this is cartitem entity
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartItem = void 0;
const typeorm_1 = require("typeorm");
const Cart_1 = require("./Cart");
const Product_1 = require("./Product");
let CartItem = class CartItem {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)()
], CartItem.prototype, "cartId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => Cart_1.Cart, cart => cart.cartItems, {
        onDelete: "CASCADE"
    }),
    (0, typeorm_1.JoinColumn)()
], CartItem.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.Column)()
], CartItem.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)()
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)()
], CartItem.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => Product_1.Product, { eager: true })
], CartItem.prototype, "product", void 0);
CartItem = __decorate([
    (0, typeorm_1.Entity)(),
    (0, typeorm_1.Index)(["cartId", "productId"], { unique: true })
], CartItem);
exports.CartItem = CartItem;
//# sourceMappingURL=CartItem.js.map