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
  'http://localhost:4200',
  'http://localhost:4000',
  'http://localhost:3000',
  'http://localhost:4201'
];

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
};

// Middleware CORS globale
app.use(cors(corsOptions));

// Middleware per parsing JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotta pubblica base
app.get('/', (_req, res) => {
  res.send('✅ Server Express per Azzurra Makeup Artist avviato con successo!');
});

// Rotte PUBBLICHE (proxy)
app.use('/b-api', proxyRoutes);

// Rotte PROTETTE con API Key
app.use('/api', authenticateApiKey, apiRoutes);

export default app;
