// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.config';
import apiRoutes from './routes';
import { authenticateApiKey } from './authMiddleware';

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://azzurra-makeup-deploy-1046780610179.europe-west1.run.app',
  'http://localhost:4200',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("CORS origin non permessa:", origin);
      callback(new Error('Accesso CORS non consentito da questo dominio'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// --- AGGIUNGI QUESTO BLOCCO ---
// Gestione manuale e universale delle richieste di preflight OPTIONS.
// Questo intercetta TUTTE le richieste OPTIONS e risponde immediatamente
// con successo (204 No Content), senza proseguire verso altri middleware.
app.options('*', cors()); 
// --- FINE BLOCCO AGGIUNTO ---

// Middleware per il parsing del body delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotta di base pubblica
app.get('/', (req, res) => {
  res.send('Server Express per Azzurra Makeup Artist avviato con successo!');
});

// Connessione al database
(async () => { await connectDB(); })();

// Applica il middleware di autenticazione e le rotte API
app.use('/api', authenticateApiKey, apiRoutes); 

export default app;