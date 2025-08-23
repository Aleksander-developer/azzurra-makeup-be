import express, { Request, Response } from 'express';
import axios from 'axios';
import FormData from 'form-data';
import multer from 'multer';

const router = express.Router();

// Configura un'istanza di Axios per le chiamate interne
// Usiamo localhost perché il server chiama se stesso
const internalApi = axios.create({
  baseURL: `http://localhost:${process.env.PORT || 8080}/api`,
  headers: {
    'x-api-key': process.env.API_KEY
  }
});

// Configurazione Multer per l'upload in memoria (identica a portfolio.routes.ts)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// PROXY per GET /portfolio
router.get('/portfolio', async (_req: Request, res: Response) => {
  try {
    const response = await internalApi.get('/portfolio');
    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
  }
});

// PROXY per GET /portfolio/:id
router.get('/portfolio/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await internalApi.get(`/portfolio/${id}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
    }
});

// PROXY per POST /portfolio (con upload di file)
router.post('/portfolio', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const form = new FormData();
    
    // Aggiungi i campi di testo al form
    for (const key in req.body) {
      form.append(key, req.body[key]);
    }

    // Aggiungi i file al form
    if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
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

// PROXY per PUT /portfolio/:id (con upload di file)
router.put('/portfolio/:id', upload.array('images', 10), async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const form = new FormData();
      
      for (const key in req.body) {
        form.append(key, req.body[key]);
      }
  
      if (req.files && Array.isArray(req.files)) {
          for (const file of req.files) {
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

// PROXY per DELETE /portfolio/:id
router.delete('/portfolio/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const response = await internalApi.delete(`/portfolio/${id}`);
      res.json(response.data);
    } catch (error: any) {
      res.status(error.response?.status || 500).json(error.response?.data || { message: 'Errore nel proxy' });
    }
});


export default router;