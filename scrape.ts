import cheerio, { root } from "cheerio";
import { parse } from "path";
import { AppDataSource } from "./src/data-source";
import { AnimeCategory } from "./src/entity/AnimeCategory";
import { Product } from "./src/entity/Product";
import { ProductCategory } from "./src/entity/ProductCategory";
import { fetch, setGlobalDispatcher, Agent} from 'undici';
setGlobalDispatcher(new Agent({connect: { timeout: 90000 }}));
const _importDynamic = new Function('modulePath', 'return import(modulePath)');

const ROOT_URL = "https://www.comicsense.store";
// export const fetch = async function (...args: any) {
//     const {default: fetch} = await _importDynamic('node-fetch');
//     return fetch(...args);
// }
function getHTML(url: string) {
  return fetch(url).then((res) => res.text());
}
function getProductsFromHTML(html: string) {
    const $ = cheerio.load(html);
    const products:any[] = [];
    $('div > div:nth-child(5) > div.nichinu-products-carousel-grid > ul > li').each((i, el) => {
        const product = {
            label: $(el).find('h2').text(),
            price: $(el).find('.price').text().split('₹')[1],
            image: $(el).find('.ct-image-container > img').first().attr('data-lazy-src'),
            shopUrl: $(el).find('a.ct-image-container').first().attr('href'),
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
    console.log("Fetching ",url);
    const html = await getHTML(url);
    console.log("Fetched ",url);
    
    const $ =  cheerio.load(html);
    const products:Partial<Product>[] = [];
    $('ul.products > li.product').each((i, el) => {
        const product:Partial<Product> = {
            productCategory,
            animeCategory,
            label: $(el).find('.woocommerce-loop-product__title').text(),
            description: "No description available",
            price: convertToPrice($(el).find('.woocommerce-Price-amount').text().split('₹')[1]),
            rating: parseFloat($(el).find('.rating').text()) || 0,
            image: $(el).find('img.wp-post-image').first().attr('src'),
            shopUrl: $(el).find('.woocommerce-LoopProduct-link').first().attr('href')
        };
        products.push(product);
    });
    for (const product of products) {
        if(!product.shopUrl) continue;
        const html = await getHTML(product.shopUrl);
        const $ =  cheerio.load(html);
        product.description = encodeURI($('.accordion-content ul').first().text());
    }
    return products;
}

async function scrape(){
    const slug = '/product-category/apparel/hoodies-jackets/hoodies';
    console.log(await getCategoryProd(slug));
}
// scrape();