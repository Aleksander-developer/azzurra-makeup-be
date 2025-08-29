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

// Rotta per la creazione di un album con file e metadati
// Multer gestisce entrambi i campi in modo robusto
router.post('/', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'imagesMetadata', maxCount: 1 } 
]), addPortfolioItem);

// Rotta per l'aggiornamento di un album con file e metadati
router.put('/:id', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'imagesMetadata', maxCount: 1 }
]), updatePortfolioItem);

router.delete('/:id', deletePortfolioItem);

export default router;