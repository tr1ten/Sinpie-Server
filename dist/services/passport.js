"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.genToken = exports.login = exports.register = exports.PassportStrategy = void 0;
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const data_source_1 = require("../data-source");
const User_1 = require("../entity/User");
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
exports.PassportStrategy = new passport_jwt_1.default.Strategy({
    jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}, (jwt_payload, done) => {
    data_source_1.AppDataSource.getRepository(User_1.User).findOne({ where: { id: jwt_payload.sub }, select: ['age', 'firstName', 'id', 'email'], relations: {
            cart: {
                cartItems: {
                    product: true
                }
            },
            favoriteProducts: true
        } }).then(user => {
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    }).catch(err => done(err, false));
});
const register = (mail, password, name) => __awaiter(void 0, void 0, void 0, function* () {
    const userRep = data_source_1.AppDataSource.getRepository(User_1.User);
    const u = yield userRep.findOne({ where: { email: mail } });
    if (u)
        throw new Error('User already exists');
    const salted = yield bcrypt_1.default.hash(password, 12);
    const user = new User_1.User();
    user.email = mail;
    user.firstName = name;
    user.password = salted;
    userRep.save(user);
    return user;
});
exports.register = register;
const login = (mail, password) => __awaiter(void 0, void 0, void 0, function* () {
    const userRep = data_source_1.AppDataSource.getRepository(User_1.User);
    const user = yield userRep.findOne({ where: { email: mail } });
    if (!user)
        throw new Error('User does not exist');
    const match = yield bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error('Invalid password');
    return user;
});
exports.login = login;
const genToken = (user) => {
    return jsonwebtoken_1.default.sign({
        iss: 'sinpie',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, process.env.JWT_SECRET);
};
exports.genToken = genToken;
//# sourceMappingURL=passport.js.map