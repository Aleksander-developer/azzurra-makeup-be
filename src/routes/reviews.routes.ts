// src/routes/reviews.routes.ts
import { Router } from 'express';
import { getReviews } from '../controllers/reviews.controller';

const router = Router();

// Definisci la rotta GET per le recensioni
router.get('/', getReviews);

export default router;

