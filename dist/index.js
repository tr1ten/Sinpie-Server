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
exports.corsOptions = void 0;
const data_source_1 = require("./data-source");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./services/passport");
const auth_1 = require("./routes/auth");
const product_1 = require("./routes/product");
const cart_1 = require("./routes/cart");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./middleware/middleware");
const morgan_1 = __importDefault(require("morgan"));
const order_1 = require("./routes/order");
const user_1 = __importDefault(require("./routes/user"));
var MySQLStore = require('express-mysql-session')(express_session_1.default);
const sessionStore = new MySQLStore(data_source_1.DB_OPTIONS);
const whitelist = ['http://localhost:3000', 'https://sinpie.vercel.app', 'http://www.ilov.tech', 'https://www.ilov.tech', 'http://ilov.tech', 'https://ilov.tech', 'https://sinpie.vercel.app/'];
exports.corsOptions = {
    credentials: true,
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error(`${origin}, Not allowed by CORS`), false);
        }
    }
};
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cookie_parser_1.default)());
    app.use(body_parser_1.default.json());
    app.use(middleware_1.ormMiddleware);
    app.use((0, express_session_1.default)({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: false,
        store: sessionStore,
        cookie: { secure: false, maxAge: 60000 }
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    passport_1.default.use(passport_2.PassportStrategy);
    const port = process.env.PORT || 3000;
    app.use('/auth', (0, cors_1.default)(exports.corsOptions), auth_1.router);
    app.use('/', product_1.router);
    app.use('/cart', (0, cors_1.default)(exports.corsOptions), cart_1.router);
    app.use('/order', (0, cors_1.default)(exports.corsOptions), order_1.router);
    app.use('/user', (0, cors_1.default)(exports.corsOptions), user_1.default);
    // route for checking if user logged in or not
    app.get('/user', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { user } = req;
            return res.status(200).json({ user });
        }
        catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }));
    app.get('/', (req, res) => {
        res.status(200).send('Welcome to sinpie api!');
    });
    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
})).catch(error => console.log(error));
//# sourceMappingURL=index.js.map