"use strict";
// this is cart entity
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cart = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const CartItem_1 = require("./CartItem");
let Cart = class Cart {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Cart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(type => User_1.User, user => user.cart)
], Cart.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0
    })
], Cart.prototype, "total", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => CartItem_1.CartItem, cartItem => cartItem.cart, {
        cascade: true,
        eager: true
    })
], Cart.prototype, "cartItems", void 0);
Cart = __decorate([
    (0, typeorm_1.Entity)()
], Cart);
exports.Cart = Cart;
//# sourceMappingURL=Cart.js.map