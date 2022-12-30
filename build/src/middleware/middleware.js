"use strict";
// middle to add orm to req.locals
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormMiddleware = void 0;
const data_source_1 = require("../data-source");
const ormMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.locals = Object.assign(Object.assign({}, req.locals), { orm: data_source_1.AppDataSource });
    next();
});
exports.ormMiddleware = ormMiddleware;
