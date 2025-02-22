"use strict";
// this subscribes to user crud action and add new cart on insert
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.UserSubscriber = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Cart_1 = require("./Cart");
let UserSubscriber = class UserSubscriber {
    /**
     * Indicates that this subscriber only listen to User events.
     */
    listenTo() {
        return User_1.User;
    }
    beforeInsert(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const cart = new Cart_1.Cart;
            yield event.manager.getRepository(Cart_1.Cart).save(cart);
            event.entity.cart = cart;
        });
    }
};
exports.UserSubscriber = UserSubscriber;
exports.UserSubscriber = UserSubscriber = __decorate([
    (0, typeorm_1.EventSubscriber)()
], UserSubscriber);
//# sourceMappingURL=UserSubscriber.js.map