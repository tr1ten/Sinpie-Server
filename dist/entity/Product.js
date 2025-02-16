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
exports.Product = void 0;
const typeorm_1 = require("typeorm");
const AnimeCategory_1 = require("./AnimeCategory");
const ProductCategory_1 = require("./ProductCategory");
const User_1 = require("./User");
const Review_1 = require("./Review");
let Product = class Product {
};
exports.Product = Product;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Product.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: 0
    }),
    __metadata("design:type", Number)
], Product.prototype, "rating", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 3000 }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: "https://www.comicsense.in"
    }),
    __metadata("design:type", String)
], Product.prototype, "shopUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: "https://www.slntechnologies.com/wp-content/uploads/2017/08/ef3-placeholder-image.jpg" }),
    __metadata("design:type", String)
], Product.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => ProductCategory_1.ProductCategory, category => category.products, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Object)
], Product.prototype, "productCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => AnimeCategory_1.AnimeCategory, category => category.products, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Object)
], Product.prototype, "animeCategory", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(type => User_1.User, user => user.favoriteProducts),
    __metadata("design:type", Object)
], Product.prototype, "favoriteUsers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, review => review.product),
    __metadata("design:type", Object)
], Product.prototype, "reviews", void 0);
exports.Product = Product = __decorate([
    (0, typeorm_1.Entity)()
], Product);
//# sourceMappingURL=Product.js.map