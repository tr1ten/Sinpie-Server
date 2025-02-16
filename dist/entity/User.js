"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const Cart_1 = require("./Cart");
const Product_1 = require("./Product");
const Review_1 = require("./Review");
let User = class User {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: "admin_s",
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "varchar",
        nullable: false,
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 9,
    }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)((type) => Product_1.Product, (product) => product.favoriteUsers),
    (0, typeorm_1.JoinTable)(),
    __metadata("design:type", Object)
], User.prototype, "favoriteProducts", void 0);
__decorate([
    (0, typeorm_1.OneToOne)((type) => Cart_1.Cart, (cart) => cart.user, { cascade: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Cart_1.Cart)
], User.prototype, "cart", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, review => review.user),
    __metadata("design:type", Object)
], User.prototype, "reviews", void 0);
User = __decorate([
    (0, typeorm_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map