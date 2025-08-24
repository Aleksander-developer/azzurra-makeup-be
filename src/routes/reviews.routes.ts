import { Router } from 'express';
import { getReviews } from '../controllers/reviews.controller';

const router = Router();

// Definisce la rotta GET per /api/reviews
router.get('/', getReviews);

export default router;