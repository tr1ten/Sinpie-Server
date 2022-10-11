import cheerio, { root } from "cheerio";
import { parse } from "path";
import { AppDataSource } from "./src/data-source";
import { AnimeCategory } from "./src/entity/AnimeCategory";
import { Product } from "./src/entity/Product";
import { ProductCategory } from "./src/entity/ProductCategory";
const _importDynamic = new Function('modulePath', 'return import(modulePath)');

const ROOT_URL = "https://www.comicsense.in";
export const fetch = async function (...args: any) {
    const {default: fetch} = await _importDynamic('node-fetch');
    return fetch(...args);
}
function getHTML(url: string) {
  return fetch(url).then((res) => res.text());
}
function getProductsFromHTML(html: string) {
    const $ = cheerio.load(html);
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
function convertToPrice(price: string): number {
    return Number(price.replace(/,/g, ''));
}
export async function getCategoryProd(catSlug:string,productCategory?:ProductCategory,animeCategory?:AnimeCategory) {
    const url = ROOT_URL + catSlug;
    const html = await getHTML(url);
    const $ =  cheerio.load(html);
    const products:Partial<Product>[] = [];
    $('ul.products > li.product').each((i, el) => {
        
        const product:Partial<Product> = {
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
}

async function scrape(){
    const slug = '/product-category/apparel/hoodies-jackets/hoodies';
    console.log(await getCategoryProd(slug));

}