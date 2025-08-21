// src/routes/auth.routes.ts
import express from 'express';
// In futuro, importerai qui il tuo controller di autenticazione
// import { loginController } from '../controllers/auth.controller';

const router = express.Router();

// Rotta per il login
// Il frontend invierà una richiesta POST a /api/auth/login
router.post('/login', (req, res) => {
    // Per ora, mandiamo una risposta di successo temporanea.
    // Qui in futuro metterai la logica che controlla email e password.
    const { email, password } = req.body;
    if (email && password) {
        res.json({ message: 'Login Finto Riuscito!', token: 'un-token-jwt-finto' });
    } else {
        res.status(400).json({ message: 'Email e password richieste.' });
    }
});

// Qui potresti aggiungere una rotta per il logout in futuro
// router.post('/logout', logoutController);

export default router;