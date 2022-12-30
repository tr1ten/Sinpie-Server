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
Object.defineProperty(exports, "__esModule", { value: true });
exports.purgeDB = exports.generateData = void 0;
const data_source_1 = require("./src/data-source");
const Product_1 = require("./src/entity/Product");
const ProductCategory_1 = require("./src/entity/ProductCategory");
const AnimeCategory_1 = require("./src/entity/AnimeCategory");
const scrape_1 = require("./scrape");
const pcats = [
    { label: "Hoodie", id: 1 },
    { label: "Jacket", id: 2 },
    { label: "Tops", id: 3 },
    { label: "Hats", id: 4 },
];
const acats = [
    { label: "Naruto", id: 1 },
    { label: "Attack on Titan", id: 2 },
    { label: "One Piece", id: 3 },
    { label: "Bleach", id: 4 },
];
const products = [
    {
        label: "Itadori Jujutsu Uniform Hooded-Tshirt", price: 799, description: "180 GSM, 100% Cotton, Pre-Shrunk & Bio-Washed Fabric", image: "https://comicsense.b-cdn.net/wp-content/uploads/2022/05/itadori-1_comicsense.jpg",
        productCategory: pcats[0],
        animeCategory: acats[0],
    },
    {
        label: "Walhalla Jacket [Classic Ed]", price: 1500,
        description: "180 GSM, 100% Cotton, Pre-Shrunk & Bio-Washed Fabric",
        image: "https://comicsense.b-cdn.net/wp-content/uploads/2022/01/walhalla_plain_front_comicsense.jpg",
        productCategory: pcats[1],
        animeCategory: acats[0],
    },
    {
        label: "Waifu Crop top", price: 399,
        description: "180 GSM, 100% Cotton, Pre-Shrunk & Bio-Washed Fabric",
        shopUrl: "https://www.comicsense.in/product/anime-waifu-crop-top",
        image: "https://comicsense.b-cdn.net/wp-content/uploads/2021/03/waifu_croptop_hanger_comicsense.jpg",
        productCategory: pcats[2],
    }
];
function generateData() {
    return __awaiter(this, void 0, void 0, function* () {
        const productRep = data_source_1.AppDataSource.getRepository(Product_1.Product);
        const productCatRep = data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory);
        const animeCatRep = data_source_1.AppDataSource.getRepository(AnimeCategory_1.AnimeCategory);
        // create then save
        yield productCatRep.save(pcats.map(cat => productCatRep.create(cat)));
        yield animeCatRep.save(acats.map(cat => animeCatRep.create(cat)));
        const savedProds = yield productRep.save(products);
    });
}
exports.generateData = generateData;
const slugMap = [
    { slug: "/product-category/apparel/hoodies-jackets/hoodies", productCategory: pcats[0], animeCategory: acats[0] },
    { slug: "/product-category/apparel/hoodies-jackets/bomber-jackets", productCategory: pcats[1], animeCategory: acats[1] },
    { slug: "/product-category/apparel/crop-tops", productCategory: pcats[2], animeCategory: acats[2] },
    { slug: "/product-category/accessories/caps-hats", productCategory: pcats[3], animeCategory: acats[3] },
];
function fetchFromSource() {
    return __awaiter(this, void 0, void 0, function* () {
        const productRep = data_source_1.AppDataSource.getRepository(Product_1.Product);
        const productCatRep = data_source_1.AppDataSource.getRepository(ProductCategory_1.ProductCategory);
        const animeCatRep = data_source_1.AppDataSource.getRepository(AnimeCategory_1.AnimeCategory);
        for (const cat of slugMap) {
            const fproducts = yield (0, scrape_1.getCategoryProd)(cat.slug, productCatRep.create(cat.productCategory), animeCatRep.create(cat.animeCategory));
            yield productRep.save(fproducts);
            console.log("Saved ", fproducts.length, " products for slug ", cat.slug);
        }
    });
}
function purgeDB() {
    return __awaiter(this, void 0, void 0, function* () {
        const entities = data_source_1.AppDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = data_source_1.AppDataSource.getRepository(entity.name); // Get repository
            yield repository.delete({}); // Delete all data
        }
    });
}
exports.purgeDB = purgeDB;
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    // await purgeDB();
    // console.log("Purged DB");
    // await generateData();
    console.log("Generated Data");
    yield fetchFromSource();
    data_source_1.AppDataSource.destroy();
}));
