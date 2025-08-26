// src/controllers/reviews.controller.ts

import { Request, Response } from 'express';
import { google } from 'googleapis';

// Semplice cache in memoria per non chiamare Google a ogni richiesta
let cachedReviews: any[] = [];
let lastFetchTime: number = 0;
const CACHE_DURATION = 1000 * 60 * 60; // Cache per 1 ora

export const getReviews = async (req: Request, res: Response) => {
  const now = Date.now();

  // Se la cache è valida, restituisci i dati salvati
  if (cachedReviews.length > 0 && (now - lastFetchTime < CACHE_DURATION)) {
    console.log('Restituisco recensioni dalla cache.');
    return res.status(200).json(cachedReviews);
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    const placeId = process.env.GMB_PLACE_ID;

    if (!apiKey || !placeId) {
      throw new Error('Chiave API di Google o Place ID non configurati nel server.');
    }

    // Inizializza il client per l'API Places
    const places = google.places({ version: 'v1', auth: apiKey });

    // Chiama l'API di Google Places per ottenere i dettagli del luogo, incluse le recensioni
    const response = await places.places.get({
      name: `places/${placeId}`,
      languageCode: 'it', // Lingua delle recensioni
      fields: 'reviews' // Chiediamo solo il campo delle recensioni
    });

    const reviews = response.data.reviews || [];

    // Aggiorna la cache
    cachedReviews = reviews;
    lastFetchTime = now;
    console.log('Recensioni recuperate da Google e salvate in cache.');

    res.status(200).json(reviews);

  } catch (error) {
    console.error('Errore nel recupero delle recensioni da Google:', error);
    // Se c'è un errore, restituisci la cache vecchia se disponibile, altrimenti un errore
    if (cachedReviews.length > 0) {
      return res.status(200).json(cachedReviews);
    }
    res.status(500).json({ message: 'Impossibile recuperare le recensioni da Google.' });
  }
};

