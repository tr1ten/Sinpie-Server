import express from 'express';
import e, { Request, Response } from 'express';
import passport from 'passport';
import { In } from 'typeorm';
import { AppDataSource } from '../data-source';
import { AnimeCategory } from '../entity/AnimeCategory';
import { Product } from '../entity/Product';
import { ProductCategory } from '../entity/ProductCategory';
import { User } from '../entity/User';
export const router = express.Router();
type $Request = Request & {user: User,query:{
    size:number,
    acat:number,
    pcat:number,
}};
router.get('/products',async (req: $Request, res: Response) => {
    const {pcat,acat,size} = req.query;
    const whereCluase = {
        productCategory: {
            id: pcat
        },
        animeCategory: {
            id: acat
        }
    };
    if(!pcat){
        delete whereCluase.productCategory;
    }
    if(!acat){
        delete whereCluase.animeCategory;
    }
    const allProds =  await AppDataSource.getRepository(Product).find({where:whereCluase,take: size ?? 10,order: {price: "DESC"}});
    return res.status(200).json({products: allProds});
})
router.get("/animeCats",async (req: Request, res: Response) => {
    const animeCategories = await AppDataSource.getRepository(AnimeCategory).find();
    return res.status(200).json({animeCategories});
})
router.get("/productCats",async (req: Request, res: Response) => {
    const productCategories = await AppDataSource.getRepository(ProductCategory).find();
    return res.status(200).json({productCategories});
});

// toggles the like of a product
router.post('/:pid/favorite',passport.authenticate('jwt',{session:false}),async (req: Request, res: Response) => {
    try{
        const {pid} =  req.params;
        const user:any = req.user;
        const product = await AppDataSource.getRepository(Product).findOne({where: {id: pid}});
        const fetchedUser = await AppDataSource.getRepository(User).findOne({where: {id: user.id},relations: {
            favoriteProducts:true
        }});
        if(!product) throw new Error('Product not found');
        if(!fetchedUser) throw new Error('User not found');
        const p =fetchedUser.favoriteProducts.find((product)=>product.id===pid)
        if(p){
            fetchedUser.favoriteProducts = fetchedUser.favoriteProducts.filter((product)=>product.id!==pid);
        }
        else{
            fetchedUser.favoriteProducts.push(product);
        }
        AppDataSource.getRepository(User).save(fetchedUser);
        return res.status(200).json({favorite:!Boolean(p)});
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }
})

// get fav of a product
router.get('/:pid/favorite',passport.authenticate('jwt',{session:false}),async (req: Request, res: Response) => {
    try{
        const {pid} =  req.params;
        const user:any = req.user;
        const product = await AppDataSource.getRepository(Product).findOne({where: {id: pid}});
        const fetchedUser = await AppDataSource.getRepository(User).findOne({where: {id: user.id},relations:{
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