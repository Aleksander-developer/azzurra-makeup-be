// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.config';
import apiRoutes from './routes';
import { authenticateApiKey } from './authMiddleware';
import proxyRoutes from './routes/proxy.routes';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://azzurra-makeup-deploy-1046780610179.europe-west1.run.app',
  'http://localhost:4200', // FE in dev classico
  'http://localhost:4000', // FE SSR locale
  'http://localhost:3000',
  'http://localhost:4201'
];

const corsOptions: cors.CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS origin non permessa:", origin);
      callback(new Error('Accesso CORS non consentito da questo dominio'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

//  Middleware CORS globale
app.use(cors(corsOptions));

//  Gestione universale delle richieste OPTIONS *prima* di qualunque autenticazione
app.options('*', cors(corsOptions));

// Middleware per il parsing del body delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotta pubblica di base
app.get('/', (req, res) => {
  res.send('✅ Server Express per Azzurra Makeup Artist avviato con successo!');
});

// NUOVO: Registra le rotte proxy PUBBLICHE sotto /b-api
// Queste rotte non hanno l'authenticateApiKey middleware
app.use('/b-api', proxyRoutes);

// ⚠️ Qui sposto l'autenticazione SOLO per le rotte API vere
app.use('/api', authenticateApiKey, apiRoutes);

export default app;
