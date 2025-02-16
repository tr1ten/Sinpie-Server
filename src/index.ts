import { AppDataSource, DB_OPTIONS } from "./data-source"
import express, { Express, Request, Response } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { PassportStrategy } from "./services/passport";
import {router as authRouter} from './routes/auth';
import {router as productRouter} from './routes/product';
import { router as cartRouter } from "./routes/cart";
import bodyParser from "body-parser";
import cors from 'cors';
import { ormMiddleware } from "./middleware/middleware";
import morgan from "morgan";
import { router as orderRouter } from "./routes/order";
import userRouter from './routes/user';
import { router as reviewRouter } from './routes/review';
var MySQLStore = require('express-mysql-session')(session);
const sessionStore = new MySQLStore(DB_OPTIONS);
const whitelist = ['http://localhost:3000','https://sinpie.vercel.app','http://www.ilov.tech','https://www.ilov.tech','http://ilov.tech','https://ilov.tech','https://sinpie.vercel.app/']
export const corsOptions = {
credentials: true,
origin: function(origin: string, callback: (arg0: Error, arg1: boolean) => void) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
  callback(null, true)
}  else {
  callback(new Error(`${origin}, Not allowed by CORS`),false)
    }
}
}
const app: Express = express();
AppDataSource.initialize().then(async () => {
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true,
        parameterLimit: 50000
    }));
    app.use(ormMiddleware);
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: false,
        store: sessionStore,
        cookie: { secure: false ,maxAge: 60000}
    }));
    app.use(cors());
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(PassportStrategy);
    const port = process.env.PORT || 3000;
    app.use('/auth',cors(corsOptions),authRouter);
    app.use('/',productRouter);
    app.use('/cart',cors(corsOptions),cartRouter);
    app.use('/order',cors(corsOptions),orderRouter);
    app.use('/user',cors(corsOptions),userRouter);
    app.use('/', reviewRouter);
    // route for checking if user logged in or not
    app.get('/user',passport.authenticate('jwt',{session:false}),async (req: Request, res: Response) => {
        try{
            const {user} = req;
            return res.status(200).json({user});
        }
        catch(e){
            return res.status(400).json({error: e.message});
        }
    });
    app.get('/', (req: Request, res: Response) => {
        res.status(200).send('Welcome to sinpie api!');
    });
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
    
}).catch(error => console.log(error))
export default app;
