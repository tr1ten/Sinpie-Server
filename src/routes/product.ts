import express from 'express';
import { Request, Response } from 'express';
import passport from 'passport';
import { AnimeCategory } from '../entity/AnimeCategory';
import { Product } from '../entity/Product';
import { ProductCategory } from '../entity/ProductCategory';
import { User } from '../entity/User';
import { logger } from '../services/logger';
import { $Request } from '../type';
export const router = express.Router();
type PRequest = $Request & {
    query:{
        size:number,
        acat:string,
        pcat:string
        }
}
router.get('/products',async (req: PRequest, res: Response) => {
    const {pcat,acat,size,filterBy,sortBy} = req.query;
    const whereCluase = {
        productCategory: {
            slug:pcat
        },
        animeCategory: {
            slug: acat
        }
    };
    if(!pcat){
        delete whereCluase.productCategory;
    }
    if(!acat){
        delete whereCluase.animeCategory;
    }
    const orderBy:any = {};
    switch (sortBy) {
        case 'price-low':
            orderBy.price = 'ASC';
            break;
        case 'price-high':
            orderBy.price = 'DESC';
        default:
            break;
    }
    const {orm} = req.locals;
    const allProds =  await orm.getRepository(Product).find({where:whereCluase,take: size ?? 10,order: orderBy,relations:{
        animeCategory:true,
        productCategory:true
    }});
    if(filterBy){
        // for now just shuffle the array
        allProds.sort(() => Math.random() - 0.5);
    }
    return res.status(200).json({products: allProds});
})
router.get("/animeCats",async (req: $Request, res: Response) => {
    const animeCategories = await req.locals.orm.getRepository(AnimeCategory).find();
    return res.status(200).json({animeCategories});
})
router.get("/productCats",async (req: $Request, res: Response) => {
    const productCategories = await req.locals.orm.getRepository(ProductCategory).find();
    return res.status(200).json({productCategories});
});

// toggles the like of a product
router.post('/:pid/favorite',passport.authenticate('jwt',{session:false}),async (req: $Request, res: Response) => {
    try{
        const {pid} =  req.params;
        const user:any = req.user;
        const product = await req.locals.orm.getRepository(Product).findOne({where: {id: pid}});
        const fetchedUser = await req.locals.orm.getRepository(User).findOne({where: {id: user.id},relations: {
            favoriteProducts:true,
            cart:true
        }});
        if(!product) throw new Error('Product not found');
        const p =fetchedUser.favoriteProducts.find((product)=>product.id===pid)
        if(p){
            fetchedUser.favoriteProducts = fetchedUser.favoriteProducts.filter((product)=>product.id!==pid);
        }
        else{
            fetchedUser.favoriteProducts.push(product);
        }
        await req.locals.orm.getRepository(User).save(fetchedUser);
        return res.status(200).json({favorite:!Boolean(p)});
    }
    catch(e){
        logger(e);
        return res.status(400).json({error: e.message});
    }
})

// get fav of a product
router.get('/:pid/favorite',passport.authenticate('jwt',{session:false}),async (req: $Request, res: Response) => {
    try{
        const {pid} =  req.params;
        const user:any = req.user;
        const product = await req.locals.orm.getRepository(Product).findOne({where: {id: pid}});
        const fetchedUser = await req.locals.orm.getRepository(User).findOne({where: {id: user.id},relations:{
            favoriteProducts: true
        }});
        if(!product) throw new Error('Product not found');
        if(!fetchedUser) throw new Error('User not found');
        const isFav = fetchedUser.favoriteProducts?.find((fav: Product) => fav.id === product.id);
        return res.status(200).json({favorite: Boolean(isFav)});
    }
    catch(e){
        console.log("Error during favorite get",e);
        
        return res.status(400).json({error: e.message});
    }
});

// fetch product details
router.get('/product/:pid',async (req: $Request, res: Response) => {
    try{
        const {pid} =  req.params;
        const product = await req.locals.orm.getRepository(Product).findOne({where: {id: pid},relations:{
            productCategory: true,
        }});
        if(!product) throw new Error('Product not found');
        return res.status(200).json({product});
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }
})
