import { AppDataSource } from "./data-source"
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

AppDataSource.initialize().then(async () => {
    const app: Express = express();
    var whitelist = ['http://localhost:3000' ]
    var corsOptions = {
    credentials: true,
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    }  else {
      callback(new Error(`${origin}, Not allowed by CORS`))
        }
    }
    }
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    app.use(ormMiddleware);
    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false ,maxAge: 60000}
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(PassportStrategy);
    const port = process.env.PORT || 3000;
    app.use('/auth', authRouter);
    app.use('/',productRouter);
    app.use('/cart',cartRouter);
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
        res.send('Welcome to sinpie api!');
    });
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
    
}).catch(error => console.log(error))
