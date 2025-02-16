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
const passport_1 = __importDefault(require("passport"));
const Review_1 = require("../entity/Review");
const Product_1 = require("../entity/Product");
const logger_1 = require("../services/logger");
exports.router = express_1.default.Router();
// Update the validateImage function
const validateImage = (image) => {
    try {
        if (!image || typeof image !== 'string')
            return false;
        const [header, content] = image.split(',');
        return Boolean(header.startsWith('data:image/') &&
            header.includes(';base64') &&
            (content === null || content === void 0 ? void 0 : content.length) > 0);
    }
    catch (_a) {
        return false;
    }
};
// Add a review
exports.router.post('/:pid/review', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pid } = req.params;
        const { comment, rating, images } = req.body;
        const { user } = req;
        const { orm } = req.locals;
        const product = yield orm.getRepository(Product_1.Product).findOne({
            where: { id: pid },
            relations: ['reviews']
        });
        if (!product)
            throw new Error('Product not found');
        // Validate and filter images
        const validImages = (images || [])
            .filter(validateImage)
            .map((img) => img.split(',')[1]) // Store only the base64 content
            .slice(0, 5); // Limit to 5 images
        const review = orm.getRepository(Review_1.Review).create({
            user,
            product,
            comment,
            rating,
            images: validImages
        });
        yield orm.getRepository(Review_1.Review).save(review);
        // Update product rating
        const reviews = yield orm.getRepository(Review_1.Review).find({
            where: { product: { id: pid } }
        });
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
            : product.rating || 1;
        yield orm.getRepository(Product_1.Product).update(pid, { rating: avgRating });
        return res.status(200).json({ review });
    }
    catch (e) {
        (0, logger_1.logger)(e);
        return res.status(400).json({ error: e.message });
    }
}));
// Get reviews for a product
exports.router.get('/:pid/reviews', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pid } = req.params;
        const { orm } = req.locals;
        const reviews = yield orm.getRepository(Review_1.Review).find({
            where: { product: { id: pid } },
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    firstName: true,
                    lastName: true
                }
            },
            order: { createdAt: 'DESC' }
        });
        return res.status(200).json({ reviews });
    }
    catch (e) {
        (0, logger_1.logger)(e);
        return res.status(400).json({ error: e.message });
    }
}));
// Update the PUT endpoint to handle existing images correctly
exports.router.put('/:pid/review/:reviewId', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pid, reviewId } = req.params;
        const { comment, rating, images } = req.body;
        const { user } = req;
        const { orm } = req.locals;
        const review = yield orm.getRepository(Review_1.Review).findOne({
            where: { id: reviewId },
            relations: ['user', 'product']
        });
        if (!review)
            throw new Error('Review not found');
        if (review.user.id !== user.id)
            throw new Error('Unauthorized');
        // Validate and filter images
        const validImages = (images || [])
            .filter((img) => {
            // If it's already a base64 string (existing image)
            if (!img.includes(','))
                return true;
            // If it's a new image, validate it
            return validateImage(img);
        })
            .map((img) => img.includes(',') ? img.split(',')[1] : img) // Only split new images
            .slice(0, 5);
        // Update review
        review.comment = comment;
        review.rating = rating;
        review.images = validImages;
        yield orm.getRepository(Review_1.Review).save(review);
        // Update product rating
        const reviews = yield orm.getRepository(Review_1.Review).find({
            where: { product: { id: pid } }
        });
        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
        yield orm.getRepository(Product_1.Product).update(pid, { rating: avgRating });
        return res.status(200).json({ review });
    }
    catch (e) {
        (0, logger_1.logger)(e);
        return res.status(400).json({ error: e.message });
    }
}));
// Add DELETE endpoint for reviews
exports.router.delete('/:pid/review/:reviewId', passport_1.default.authenticate('jwt', { session: false }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pid, reviewId } = req.params;
        const { user } = req;
        const { orm } = req.locals;
        const review = yield orm.getRepository(Review_1.Review).findOne({
            where: { id: reviewId },
            relations: ['user', 'product']
        });
        if (!review)
            throw new Error('Review not found');
        if (review.user.id !== user.id)
            throw new Error('Unauthorized');
        yield orm.getRepository(Review_1.Review).remove(review);
        // Update product rating
        const reviews = yield orm.getRepository(Review_1.Review).find({
            where: { product: { id: pid } }
        });
        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
            : 0;
        yield orm.getRepository(Product_1.Product).update(pid, { rating: avgRating });
        return res.status(200).json({ success: true });
    }
    catch (e) {
        (0, logger_1.logger)(e);
        return res.status(400).json({ error: e.message });
    }
}));
//# sourceMappingURL=review.js.map