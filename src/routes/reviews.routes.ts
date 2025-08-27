// src/routes/reviews.routes.ts
import { Router } from 'express';
import { getReviews } from '../controllers/reviews.controller';

const router = Router();

// Gestisce esplicitamente la richiesta OPTIONS per il CORS
router.options('/', (req, res) => {
    res.status(200).send();
});

// Definisci la rotta GET per le recensioni
router.get('/', getReviews);

export default router;