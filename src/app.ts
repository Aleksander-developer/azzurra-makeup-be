// src/app.ts
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB } from './config/db.config';
import apiRoutes from './routes';
import { authenticateApiKey } from './authMiddleware'; // <-- NUOVO: Importa il middleware di autenticazione

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://azzurra-makeup-deploy-1046780610179.europe-west1.run.app', // Questo sarà l'URL del tuo frontend su Cloud Run
  'http://localhost:4200', // Per lo sviluppo locale di Angular
  'http://localhost:3000' // Per il backend stesso se fai richieste interne
];

app.use(cors({
  origin: function (origin, callback) {
    // Permetti richieste senza origine (es. Postman)
    if (!origin) return callback(null, true);

    // Controlla se l'origine della richiesta inizia con uno degli URL permessi
    const isAllowed = allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin));
    
    if (isAllowed) {
      return callback(null, true);
    } else {
      console.log("CORS origin non permessa:", origin);
      return callback(new Error('Accesso CORS non consentito da questo dominio'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
}));

// Middleware per il parsing del body delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotta di base per testare che il server sia attivo (questa sarà PUBBLICA)
// La metto PRIMA del middleware di autenticazione se vuoi che sia accessibile senza chiave API
app.get('/', (req, res) => {
  res.send('Server Express per Azzurra Makeup Artist avviato con successo!');
});

// Connessione al database
(async () => { await connectDB(); })();

// Applica il middleware di autenticazione API Key
// Tutte le route definite DOPO questa riga richiederanno la chiave API
app.use('/api', authenticateApiKey, apiRoutes); 

// Applichiamo le rotte senza autenticazione, come nel progetto funzionante
// app.use('/api', apiRoutes); 

export default app;
