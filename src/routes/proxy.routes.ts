// src/routes/proxy.routes.ts

import express, { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';

const router = express.Router();

// Configura un'istanza di Axios per le chiamate interne
const internalApi = axios.create({
  baseURL: `http://localhost:${process.env.PORT || 8080}/api`,
  headers: {
    'x-api-key': process.env.API_KEY
  }
});

const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } 
});

// --- PROXY PER IL PORTFOLIO (già esistente) ---
router.get('/portfolio', async (_req: Request, res: Response) => {
  try {
    const response = await internalApi.get('/portfolio');
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
  }
});

router.get('/portfolio/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await internalApi.get(`/portfolio/${id}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
    }
});

// Modificato per usare upload.fields
router.post('/portfolio', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'imagesMetadata', maxCount: 1 } 
]), async (req: Request, res: Response) => {
  try {
    const form = new FormData();
    for (const key in req.body) {
      form.append(key, req.body[key]);
    }
    // Corretto per l'uso di req.files con upload.fields
    const files = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'] || [];
    if (files && Array.isArray(files)) {
        for (const file of files) {
            form.append('images', file.buffer, { filename: file.originalname, contentType: file.mimetype });
        }
    }
    const response = await internalApi.post('/portfolio', form, {
      headers: { ...form.getHeaders() }
    });
    res.status(201).json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
  }
});

// Modificato per usare upload.fields
router.put('/portfolio/:id', upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'imagesMetadata', maxCount: 1 }
]), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const form = new FormData();
      for (const key in req.body) {
        form.append(key, req.body[key]);
      }
      // Corretto per l'uso di req.files con upload.fields
      const files = (req.files as { [fieldname: string]: Express.Multer.File[] })['images'] || [];
      if (files && Array.isArray(files)) {
          for (const file of files) {
              form.append('images', file.buffer, { filename: file.originalname, contentType: file.mimetype });
          }
      }
      const response = await internalApi.put(`/portfolio/${id}`, form, {
        headers: { ...form.getHeaders() }
      });
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
    }
});

router.delete('/portfolio/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await internalApi.delete(`/portfolio/${id}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
    }
});


// --- NUOVO: PROXY PER IL FORM CONTATTI ---
router.post('/contatti', async (req: Request, res: Response) => {
  try {
    // Inoltra semplicemente il corpo della richiesta (i dati del form)
    // all'endpoint interno e sicuro /api/contatti
    const response = await internalApi.post('/contatti', req.body);
    
    // Inoltra la risposta di successo (es. status 201) al frontend
    res.status(response.status).json(response.data);
  } catch (error: any) {
    // In caso di errore, inoltra la risposta di errore al frontend
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy dei contatti' });
  }
});


// NUOVO: PROXY PER GET /reviews
router.get('/reviews', async (_req: Request, res: Response) => {
  try {
    const response = await internalApi.get('/reviews');
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy delle recensioni' });
  }
});


export default router;