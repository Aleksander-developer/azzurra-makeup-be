// src/routes/index.ts
import express from 'express';
import chiSonoRoutes from './chi-sono.routes';
import contattiRoutes from './contatti.routes';
import serviziRoutes from './servizi.routes';
import authRoutes from './auth.routes';
import reviewsRoutes from './reviews.routes';
// import portfolioRoutes from './portfolio.routes';

const router = express.Router();

router.use('/chi-sono', chiSonoRoutes);
router.use('/contatti', contattiRoutes);
router.use('/servizi', serviziRoutes);
// router.use('/portfolio', portfolioRoutes); 
router.use('/reviews', reviewsRoutes);


router.use('/auth', authRoutes);

export default router;

