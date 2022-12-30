"use strict";
// this is order entity
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const Cart_1 = require("./Cart");
let Order = class Order {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0
    })
], Order.prototype, "totalPrice", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0
    })
], Order.prototype, "totalQuantity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => Cart_1.Cart, {
        onDelete: 'CASCADE'
    })
], Order.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)()
], Order.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)()
], Order.prototype, "updatedAt", void 0);
Order = __decorate([
    (0, typeorm_1.Entity)()
], Order);
exports.Order = Order;
//# sourceMappingURL=Order.js.map