import express from 'express';
import { Request, Response } from 'express';
import { genToken, login, register } from '../services/passport';
import { validateMail } from '../validators/common';

export const router = express.Router();
router.post('/register',async (req: Request, res: Response) => {
    try{
        const {email, password,username} = req.body;
        if(!email || !password || !validateMail(email)) throw new Error('Valid Email and password are required');
        const user = await register(email, password,username);
        const token = genToken(user);
        return res.status(200).json({token});
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }
});

router.post('/login',async (req: Request, res: Response) => {
    try{
        const {email, password} = req.body;
        if(!email || !password || !validateMail(email)) throw new Error('Valid Email and password are required');
        const user = await login(email, password);
        const token = genToken(user);
        return res.status(200).json({token});
    }
    catch(e){
        return res.status(400).json({error: e.message});
    }
});

