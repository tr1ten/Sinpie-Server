import { AppDataSource } from "./src/data-source";
import { Product } from "./src/entity/Product";
import { ProductCategory } from "./src/entity/ProductCategory";
import { AnimeCategory } from "./src/entity/AnimeCategory";
import { getCategoryProd } from "./scrape";
const pcats:Partial<ProductCategory>[] = [
    {label:"Hoodie",id:1},
    {label:"Jacket",id:2},
    {label:"Tops",id:3},
    {label:"Hats",id:4},
]
const acats:Partial<AnimeCategory>[] = [
    {label:"Naruto",id:1},
    {label:"Attack on Titan",id:2},
    {label:"One Piece",id:3},
    {label:"Bleach",id:4},
]
const products:Partial<Product>[] = [
    {
        label:"Itadori Jujutsu Uniform Hooded-Tshirt",price:799,description:"180 GSM, 100% Cotton, Pre-Shrunk & Bio-Washed Fabric",image:"https://comicsense.b-cdn.net/wp-content/uploads/2022/05/itadori-1_comicsense.jpg",
        productCategory:pcats[0] as ProductCategory,
        animeCategory:acats[0] as AnimeCategory,
        
    },
    {
        label:"Walhalla Jacket [Classic Ed]",price:1500,
        description:"180 GSM, 100% Cotton, Pre-Shrunk & Bio-Washed Fabric",
        image:"https://comicsense.b-cdn.net/wp-content/uploads/2022/01/walhalla_plain_front_comicsense.jpg",
        productCategory:pcats[1] as ProductCategory,
        animeCategory:acats[0] as AnimeCategory,
    },
    {
        label:"Waifu Crop top",price:399,
        description:"180 GSM, 100% Cotton, Pre-Shrunk & Bio-Washed Fabric",
        shopUrl: "https://www.comicsense.in/product/anime-waifu-crop-top",
        image:"https://comicsense.b-cdn.net/wp-content/uploads/2021/03/waifu_croptop_hanger_comicsense.jpg",
        productCategory:pcats[2] as ProductCategory,
    }
]
export async function generateData(){
    const productRep = AppDataSource.getRepository(Product);
    const productCatRep = AppDataSource.getRepository(ProductCategory);
    const animeCatRep = AppDataSource.getRepository(AnimeCategory);
    // create then save
    await productCatRep.save(pcats.map(cat=>productCatRep.create(cat)));
    await animeCatRep.save(acats.map(cat=>animeCatRep.create(cat)));
    const savedProds= await productRep.save(products);
}
const slugMap = [
    {slug:"/product-category/apparel/hoodies-jackets/hoodies",productCategory:pcats[0] as ProductCategory,animeCategory:acats[0] as AnimeCategory},
    {slug:"/product-category/apparel/hoodies-jackets/bomber-jackets",productCategory:pcats[1] as ProductCategory,animeCategory:acats[1] as AnimeCategory},
    {slug:"/product-category/apparel/crop-tops",productCategory:pcats[2] as ProductCategory,animeCategory:acats[2] as AnimeCategory},
    {slug:"/product-category/accessories/caps-hats",productCategory:pcats[3] as ProductCategory,animeCategory:acats[3] as AnimeCategory},
]
async function fetchFromSource(){
    await AppDataSource.manager.transaction(async (transactionalEntityManager)=>{
        const productRep = transactionalEntityManager.getRepository(Product);
        const productCatRep = transactionalEntityManager.getRepository(ProductCategory);
        const animeCatRep = transactionalEntityManager.getRepository(AnimeCategory);
        for (const cat of slugMap) {
            const fproducts = await getCategoryProd(cat.slug,productCatRep.create(cat.productCategory),animeCatRep.create(cat.animeCategory));
            await productRep.save(fproducts);
            console.log("Saved ",fproducts.length," products for slug ",cat.slug);
        }
    });
}
export async function purgeDB(){
    const entities = AppDataSource.entityMetadatas;
        for (const entity of entities) {
            const repository = AppDataSource.getRepository(entity.name); // Get repository
            await repository.delete({}); // Delete all data
        }
}
AppDataSource.initialize().then(async ()=>{
    await purgeDB();
    console.log("Purged DB");
    await generateData();
    console.log("Generated Data");
    await fetchFromSource();
    AppDataSource.destroy();
})