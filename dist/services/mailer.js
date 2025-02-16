"use strict";
// do normal nodemailer setup
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
exports.mailOrder = mailOrder;
const nodemailer_1 = __importDefault(require("nodemailer"));
require('dotenv').config();
const configOpt = {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
};
const transporter = nodemailer_1.default.createTransport(configOpt);
function mailOrder(subject, html, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let info = yield transporter.sendMail({
                from: configOpt.auth.user,
                to,
                subject: subject, // Subject line
                html // html body
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        }
        catch (err) {
            console.log(err);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        mailOrder("test", "test", '');
    });
}
//# sourceMappingURL=mailer.js.map