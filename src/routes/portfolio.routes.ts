// src/routes/portfolio.routes.ts
import express from 'express';
import multer from 'multer';
import {
  getPortfolioItems,
  getPortfolioItemById,
  addPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../controllers/portfolio.controller';

const router = express.Router();

// Configurazione Multer per l'upload in memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rotte per il Portfolio
router.get('/', getPortfolioItems);
router.get('/:id', getPortfolioItemById);

// Aggiunta elemento portfolio (solo immagini multiple)
router.post('/', upload.array('images', 10), addPortfolioItem);

// Update elemento portfolio (solo immagini multiple)
router.put('/:id', upload.array('images', 10), updatePortfolioItem);

router.delete('/:id', deletePortfolioItem);

export default router;
