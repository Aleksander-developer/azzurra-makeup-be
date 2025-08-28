import express from 'express';
import portfolioRoutes from './portfolio.routes';
import reviewsRoutes from './reviews.routes';
import contattiRoutes from './contatti.routes';
import chiSonoRoutes from './chi-sono.routes';
import serviziRoutes from './servizi.routes';
import authRoutes from './auth.routes';

const router = express.Router();

// Rotte pubbliche
router.use('/portfolio', portfolioRoutes);
router.use('/reviews', reviewsRoutes);
router.use('/contatti', contattiRoutes);
router.use('/chi-sono', chiSonoRoutes);
router.use('/servizi', serviziRoutes);

// Login (protegge con username+password)
router.use('/auth', authRoutes);

export default router;
