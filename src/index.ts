// src/index.ts
import app from './app';
import { connectDB } from './config/db.config';

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  try {
    // 1. Prima tenta la connessione al database
    await connectDB();
    
    // 2. Solo se la connessione ha successo, avvia il server Express
    app.listen(PORT, () => {
      console.log(`✅ Server avviato e connesso al DB su porta: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Impossibile avviare il server, errore di connessione al DB:", error);
    process.exit(1); // Esce dal processo se non riesce a connettersi al DB
  }
};

startServer();

