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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const passport_1 = require("../services/passport");
const common_1 = require("../validators/common");
exports.router = express_1.default.Router();
exports.router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, username } = req.body;
        if (!email || !password || !(0, common_1.validateMail)(email))
            throw new Error('Valid Email and password are required');
        const user = yield (0, passport_1.register)(email, password, username);
        const token = (0, passport_1.genToken)(user);
        return res.status(200).json({ token });
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
}));
exports.router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password || !(0, common_1.validateMail)(email))
            throw new Error('Valid Email and password are required');
        const user = yield (0, passport_1.login)(email, password);
        const token = (0, passport_1.genToken)(user);
        return res.status(200).json({ token });
    }
    catch (e) {
        return res.status(400).json({ error: e.message });
    }
}));
//# sourceMappingURL=auth.js.map