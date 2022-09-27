// middle to add orm to req.locals

import { Response, NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { $Request } from "../type";
 

export const ormMiddleware = async (req: $Request, res: Response, next: NextFunction) => {
    req.locals = {
        ...req.locals,
        orm: AppDataSource
    }
    next();
}