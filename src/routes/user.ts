// router for handling /user routes

import express from 'express';
import { Response } from 'express';

import passport from 'passport';
import { $Request } from '../type';

const router = express.Router();

// route for getting all user favorites
router.get('/favorites',passport.authenticate('jwt',{session:false}),async (req: $Request, res: Response) => {
    try{
        const user = req.user;
        const favorites = await user.favoriteProducts;
        return res.status(200).send({favorites});
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }
})

export default router;