"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)()
], AnimeCategory.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)()
], AnimeCategory.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    })
], AnimeCategory.prototype, "image", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(type => Product_1.Product, product => product.animeCategory)
], AnimeCategory.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: "",
    })
], AnimeCategory.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)()
], AnimeCategory.prototype, "sluggifyTitles", null);
AnimeCategory = __decorate([
    (0, typeorm_1.Entity)()
], AnimeCategory);
exports.AnimeCategory = AnimeCategory;
//# sourceMappingURL=AnimeCategory.js.map