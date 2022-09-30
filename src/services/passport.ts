import JWTStrategy from 'passport-jwt';
import { AppDataSource } from '../data-source';
import {User} from '../entity/User';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
dotenv.config();


export const PassportStrategy = new JWTStrategy.Strategy({
    jwtFromRequest: JWTStrategy.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET}, 
    (jwt_payload, done) => {
        AppDataSource.getRepository(User).findOne({where:{id: jwt_payload.sub},select:['age','firstName','id','email'],relations:{
            cart:{
                cartItems:{
                    product:true
                }
            },
            favoriteProducts:true
            
        }}).then(user => {
            if(user){
                return done(null, user);
            }
            return done(null, false);
        }).catch(err => done(err, false));
    }
);

export const register = async (mail: string, password: string,name:string) => {
    const userRep = AppDataSource.getRepository(User);
    const u = await userRep.findOne({where:{email: mail}});
    if(u) throw new Error('User already exists');
    const salted = await bcrypt.hash(password, 12);
    const user = new User();
    user.email = mail;
    user.firstName = name;
    user.password = salted;
    userRep.save(user);
    return user;
}

export const login = async (mail: string, password: string) => {
    const userRep = AppDataSource.getRepository(User);
    const user = await userRep.findOne({where:{email: mail}});
    if(!user) throw new Error('User does not exist');
    const match = await bcrypt.compare(password, user.password);
    if(!match) throw new Error('Invalid password');
    return user;
}

export const genToken = (user:User)=>{
    return jwt.sign({
        iss: 'sinpie',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.JWT_SECRET);
}