import express, { Request, Response } from "express";
import passport from "passport";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Product } from "../entity/Product";
import { User } from "../entity/User";
import { $Request } from "../type";
import {logger} from '../services/logger';

export const router = express.Router();
// add to cart particular product   
router.post('/add',passport.authenticate('jwt',{session:false}),async (req: $Request, res: Response) => {
    const {pid,qty} =  req.body;
    const {user} = req;
    const {orm} = req.locals;
    try{
        const product = await orm.getRepository(Product).findOne({where: {id: pid}});
        const fetchedUser = await orm.getRepository(User).findOne({where: {id: user.id},relations: {
            cart:true
        }});
        if(!product) throw new Error('Product not found');
        if(!fetchedUser) throw new Error('User not found');
        const cartRep = orm.getRepository(Cart);
        const cart = fetchedUser.cart;
        const cartItem = {
            product:product,
            quantity:qty,
            cart:cart,
            cartId:cart.id,
            price:product.price*qty

        };
        // saving it along with cart doesn't work for reason
        await orm.getRepository(CartItem).save(cartItem);
        cart.total += cartItem.price;
        await cartRep.save(cart);
        return res.status(200).json({added: 'true'});
    }
    catch(error){
        logger(error);
        return res.status(400).json({error: 'Something went wrong'});
    }
});

// return all cart items
router.get('/',passport.authenticate('jwt',{session:false}),async (req: $Request, res: Response) => {
    const {user} = req;
    const {orm} = req.locals;
    try{
        const cart = user.cart;
        const ucart = await orm.getRepository(Cart).findOne({where: {id: cart.id},relations:{
            cartItems:{
                product:true
            }
        }});
        return res.status(200).json({cart});
    }
    catch(error){
        logger(error);
        return res.status(400).json({error: 'Something went wrong'});
    }
})

// update the cart item qty
router.post('/update',passport.authenticate('jwt',{session:false}),async (req: $Request, res: Response) => {
    const {pid,qty} =  req.body;
    const {user} = req;
    const {orm} = req.locals;
    const {cart} = user;
    try{
        const product = await orm.getRepository(Product).findOne({where: {id: pid}});
        if(!product) throw new Error('Product not found');
        const cartItem = await orm.getRepository(CartItem).findOne({where: {cartId: cart.id, productId: product.id}});
        if(!cartItem) throw new Error('Cart item not found');
        if(qty === 0){
            await orm.getRepository(CartItem).delete({cartId: cart.id, productId: product.id});
            cart.total -= cartItem.price;
        }
        else{
            cartItem.quantity = qty;
            cartItem.price = product.price*qty;
            await orm.getRepository(CartItem).save(cartItem);
        }
        return res.status(200).json({updated: 'true'});
    }
    catch(error){
        logger(error);
        return res.status(400).json({error: 'Something went wrong'});
    }
})


// fetch cart item quantity
router.get('/:pid',passport.authenticate('jwt',{session:false}),async (req: $Request, res: Response) => {
    const {pid} =  req.params;
    const {user} = req;
    const {orm} = req.locals;
    const {cart} = user;
    try{
        const product = await orm.getRepository(Product).findOne({where: {id: pid}});
        if(!product) throw new Error('Product not found');
        const cartItem = await orm.getRepository(CartItem).findOne({where: {cartId: cart.id, productId: product.id}});
        return res.status(200).json({quantity: cartItem?.quantity ?? 0});
    }
    catch(error){
        logger(error);
        return res.status(400).json({error: 'Something went wrong'});
    }
})