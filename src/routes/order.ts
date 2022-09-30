// route for recieving fake orders then send to client mail using nodemailer

import { Router } from "express";
import passport from "passport";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { Order } from "../entity/Order";
import { logger } from "../services/logger";
import { mailOrder } from "../services/mailer";
import { $Request } from "../type";

export const router = Router();
// this route will order the cart of the user
router.post("/", passport.authenticate('jwt',{session:false}),async (req:$Request, res) => {
    const {user} = req;
    const {orm} = req.locals;
    try{ 
        let order:Order = new Order();
        order.cart = user.cart;
        order.totalPrice = user.cart.total;
        order.totalQuantity = 1;
        const orderRep = orm.getRepository(Order);
        // clear cart items
        const cart = user.cart;
        // delete all cartitems
        await orm.getRepository(CartItem).delete({cartId:cart.id});
        order = await orderRep.save(order);
        const formattedHtml = `
        <h1>Order Recieved</h1>
        <h2>Order Details</h2>
        <p>Order Id: ${order.id}</p>
        <p>Order Date: ${order.createdAt}</p>
        <p>Order Total Price: ${order.totalPrice}</p>
        <p>Order Total Quantity: ${order.totalQuantity}</p>
        <h2>Order Items</h2>
        <ul>
        ${order.cart.cartItems.map(item => `<li>${item.product.label} - ${item.price}</li>`).join("")}`
        mailOrder("Order Recieved from Sinpie ~",formattedHtml,user.email);
        res.status(200).json({order:true});
    } 
    catch(err){
        logger(err);
        return res.status(500).send({order:false});
    }
});