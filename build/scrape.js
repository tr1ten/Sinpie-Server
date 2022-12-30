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
exports.getCategoryProd = exports.fetch = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const _importDynamic = new Function('modulePath', 'return import(modulePath)');
const ROOT_URL = "https://www.comicsense.in";
const fetch = function (...args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { default: fetch } = yield _importDynamic('node-fetch');
        return fetch(...args);
    });
};
exports.fetch = fetch;
function getHTML(url) {
    return (0, exports.fetch)(url).then((res) => res.text());
}
function getProductsFromHTML(html) {
    const $ = cheerio_1.default.load(html);
    const products = [];
    $('div > div:nth-child(5) > div.nichinu-products-carousel-grid > ul > li').each((i, el) => {
        const product = {
            label: $(el).find('h2').text(),
            price: $(el).find('.price').text().split('₹')[1],
            image: $(el).find('.ct-image-container > img').first().attr('data-lazy-src'),
            shopUrl: $(el).find('a.ct-image-container').first().attr('href')
        };
        products.push(product);
    });
    return products;
}
function convertToPrice(price) {
    return Number(price.replace(/,/g, ''));
}
function getCategoryProd(catSlug, productCategory, animeCategory) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = ROOT_URL + catSlug;
        const html = yield getHTML(url);
        const $ = cheerio_1.default.load(html);
        const products = [];
        $('ul.products > li.product').each((i, el) => {
            const product = {
                productCategory,
                animeCategory,
                label: $(el).find('.woocommerce-loop-product__title').text(),
                description: "This is description placeholder, please update it :^",
                price: convertToPrice($(el).find('.woocommerce-Price-amount').text().split('₹')[1]),
                image: $(el).find('img.attachment-woocommerce_thumbnail').first().attr('data-lazy-src'),
                shopUrl: $(el).find('.woocommerce-LoopProduct-link').first().attr('href')
            };
            products.push(product);
        });
        return products;
    });
}
exports.getCategoryProd = getCategoryProd;
function scrape() {
    return __awaiter(this, void 0, void 0, function* () {
        const slug = '/product-category/apparel/hoodies-jackets/hoodies';
        console.log(yield getCategoryProd(slug));
    });
}
