import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes';
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
  allowedHeaders: ['Content-Type', 'Authorization']
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

// NUOVO: Registra le rotte proxy PUBBLICHE sotto /b-api
app.use('/b-api', proxyRoutes); // Rotte pubbliche che non richiedono autenticazione


// Tutte le API pubbliche sotto /api
app.use('/api', apiRoutes);

export default app;
