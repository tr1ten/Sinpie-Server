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
exports.AnimeCategory = void 0;
const typeorm_1 = require("typeorm");
const util_1 = require("../helpers/util");
const Product_1 = require("./Product");
let AnimeCategory = class AnimeCategory {
    // trigger that will generate slug value when new row is inserted 
    sluggifyTitles() {
        this.slug = (0, util_1.titleToSlug)(this.label);
    }
};
exports.AnimeCategory = AnimeCategory;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], AnimeCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AnimeCategory.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", String)
], AnimeCategory.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => Product_1.Product, product => product.animeCategory),
    __metadata("design:type", Object)
], AnimeCategory.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: "",
    }),
    __metadata("design:type", String)
], AnimeCategory.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AnimeCategory.prototype, "sluggifyTitles", null);
exports.AnimeCategory = AnimeCategory = __decorate([
    (0, typeorm_1.Entity)()
], AnimeCategory);
//# sourceMappingURL=AnimeCategory.js.map