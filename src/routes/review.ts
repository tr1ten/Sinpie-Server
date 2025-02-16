import express from 'express';
import { Response } from 'express';
import passport from 'passport';
import { Review } from '../entity/Review';
import { Product } from '../entity/Product';
import { $Request } from '../type';
import { logger } from '../services/logger';

export const router = express.Router();

// Update the validateImage function
const validateImage = (image: string): boolean => {
    try {
        if (!image || typeof image !== 'string') return false;
        const [header, content] = image.split(',');
        return Boolean(
            header.startsWith('data:image/') &&
            header.includes(';base64') &&
            content?.length > 0
        );
    } catch {
        return false;
    }
};

// Add a review
router.post('/:pid/review', passport.authenticate('jwt', {session: false}), async (req: $Request, res: Response) => {
    try {
        const { pid } = req.params;
        const { comment, rating, images } = req.body;
        const { user } = req;
        const { orm } = req.locals;

        const product = await orm.getRepository(Product).findOne({
            where: { id: pid },
            relations: ['reviews']
        });

        if (!product) throw new Error('Product not found');

        // Validate and filter images
        const validImages = (images || [])
            .filter(validateImage)
            .map((img: string) => img.split(',')[1]) // Store only the base64 content
            .slice(0, 5); // Limit to 5 images

        const review = orm.getRepository(Review).create({
            user,
            product,
            comment,
            rating,
            images: validImages
        });

        await orm.getRepository(Review).save(review);

        // Update product rating
        const reviews = await orm.getRepository(Review).find({
            where: { product: { id: pid } }
        });

        const avgRating = reviews.length > 0 
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
            : product.rating || 1;

        await orm.getRepository(Product).update(pid, { rating: avgRating });

        return res.status(200).json({ review });
    } catch (e) {
        logger(e);
        return res.status(400).json({ error: e.message });
    }
});

// Get reviews for a product
router.get('/:pid/reviews', async (req: $Request, res: Response) => {
    try {
        const { pid } = req.params;
        const { orm } = req.locals;

        const reviews = await orm.getRepository(Review).find({
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
    } catch (e) {
        logger(e);
        return res.status(400).json({ error: e.message });
    }
});

// Update the PUT endpoint to handle existing images correctly
router.put('/:pid/review/:reviewId', passport.authenticate('jwt', {session: false}), async (req: $Request, res: Response) => {
    try {
        const { pid, reviewId } = req.params;
        const { comment, rating, images } = req.body;
        const { user } = req;
        const { orm } = req.locals;

        const review = await orm.getRepository(Review).findOne({
            where: { id: reviewId },
            relations: ['user', 'product']
        });

        if (!review) throw new Error('Review not found');
        if (review.user.id !== user.id) throw new Error('Unauthorized');

        // Validate and filter images
        const validImages = (images || [])
            .filter((img: string) => {
                // If it's already a base64 string (existing image)
                if (!img.includes(',')) return true;
                // If it's a new image, validate it
                return validateImage(img);
            })
            .map((img: string) => img.includes(',') ? img.split(',')[1] : img) // Only split new images
            .slice(0, 5);

        // Update review
        review.comment = comment;
        review.rating = rating;
        review.images = validImages;

        await orm.getRepository(Review).save(review);

        // Update product rating
        const reviews = await orm.getRepository(Review).find({
            where: { product: { id: pid } }
        });

        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;
        await orm.getRepository(Product).update(pid, { rating: avgRating });

        return res.status(200).json({ review });
    } catch (e) {
        logger(e);
        return res.status(400).json({ error: e.message });
    }
});

// Add DELETE endpoint for reviews
router.delete('/:pid/review/:reviewId', passport.authenticate('jwt', {session: false}), async (req: $Request, res: Response) => {
    try {
        const { pid, reviewId } = req.params;
        const { user } = req;
        const { orm } = req.locals;

        const review = await orm.getRepository(Review).findOne({
            where: { id: reviewId },
            relations: ['user', 'product']
        });

        if (!review) throw new Error('Review not found');
        if (review.user.id !== user.id) throw new Error('Unauthorized');

        await orm.getRepository(Review).remove(review);

        // Update product rating
        const reviews = await orm.getRepository(Review).find({
            where: { product: { id: pid } }
        });

        const avgRating = reviews.length > 0
            ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
            : 0;

        await orm.getRepository(Product).update(pid, { rating: avgRating });

        return res.status(200).json({ success: true });
    } catch (e) {
        logger(e);
        return res.status(400).json({ error: e.message });
    }
}); 