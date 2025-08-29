// src/controllers/portfolio.controller.ts

import { Request, Response } from 'express';
import { PortfolioItem, IPortfolioImage } from '../models/portfolio-item.model';
import cloudinary from '../config/cloudinary.config';

// Funzione helper per caricare un buffer (file in memoria) su Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'azzurra-makeup/portfolio-gallery', quality: "auto:low", fetch_format: "auto" },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

// GET: Ottiene tutti gli elementi del portfolio
export const getPortfolioItems = async (_req: Request, res: Response) => {
    try {
        const items = await PortfolioItem.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero degli elementi', error });
    }
};

// GET: Ottiene un singolo elemento per ID
export const getPortfolioItemById = async (req: Request, res: Response) => {
    try {
        const item = await PortfolioItem.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Elemento non trovato' });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dell\'elemento', error });
    }
};

// POST: Aggiunge un nuovo elemento
export const addPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { title, category, subtitle, description } = req.body;
    
    // CORREZIONE QUI: estrai i file dall'oggetto `req.files`
    const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
    const files = uploadedFiles['images'] || [];

    let imagesMetadata: IPortfolioImage[] = [];
    if (req.body.imagesMetadata) {
      try {
        imagesMetadata = JSON.parse(req.body.imagesMetadata);
      } catch {
        return res.status(400).json({ message: "Il campo 'imagesMetadata' non è un JSON valido." });
      }
    }

    if (!title || !category) {
      return res.status(400).json({ message: 'Titolo e Categoria sono obbligatori.' });
    }

    const galleryImagesUrls: IPortfolioImage[] = [];
    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const result = await uploadToCloudinary(file.buffer);
        const metadata = imagesMetadata[i] || {};
        galleryImagesUrls.push({
          src: result.secure_url,
          description: metadata.description || '',
          alt: metadata.alt || ''
        });
      }
    }

    const newItem = new PortfolioItem({ title, subtitle, description, category, images: galleryImagesUrls });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    console.error("Errore nell'aggiunta:", error);
    res.status(500).json({ message: 'Errore nell\'aggiunta dell\'elemento del portfolio', error });
  }
};

// PUT: Aggiorna un elemento esistente
export const updatePortfolioItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, category, subtitle, description } = req.body;
        
        // CORREZIONE QUI: Accedi all'array di file tramite la chiave 'images'
        const uploadedFiles = req.files as { [fieldname: string]: Express.Multer.File[] };
        const files = uploadedFiles['images'] || [];

        let imagesMetadata: IPortfolioImage[] = [];
        if (req.body.imagesMetadata) {
            try {
                imagesMetadata = JSON.parse(req.body.imagesMetadata);
            } catch {
                return res.status(400).json({ message: "Il campo 'imagesMetadata' non è un JSON valido." });
            }
        }

        const itemToUpdate = await PortfolioItem.findById(id);
        if (!itemToUpdate) {
            return res.status(404).json({ message: 'Elemento del portfolio non trovato' });
        }

        itemToUpdate.title = title ?? itemToUpdate.title;
        itemToUpdate.subtitle = subtitle ?? itemToUpdate.subtitle;
        itemToUpdate.description = description ?? itemToUpdate.description;
        itemToUpdate.category = category ?? itemToUpdate.category;

        const finalImages: IPortfolioImage[] = [];
        let newFilesIndex = 0;
        
        for (const metadata of imagesMetadata) {
            if (metadata.isNew) {
                const file = files[newFilesIndex];
                if (file) {
                    const result = await uploadToCloudinary(file.buffer);
                    finalImages.push({
                        src: result.secure_url,
                        description: metadata.description || '',
                        alt: metadata.alt || ''
                    });
                    newFilesIndex++;
                }
            } else {
                finalImages.push({
                    src: metadata.src,
                    description: metadata.description,
                    alt: metadata.alt
                });
            }
        }
        
        itemToUpdate.images = finalImages;
        const updatedItem = await itemToUpdate.save();
        res.json(updatedItem);
        
    } catch (error) {
        console.error("Errore nell'aggiornamento:", error);
        res.status(500).json({ message: 'Errore nell\'aggiornamento dell\'elemento del portfolio', error });
    }
};

// DELETE: Elimina un elemento
export const deletePortfolioItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await PortfolioItem.findByIdAndDelete(id);

        if (!item) {
            return res.status(404).json({ message: 'Elemento del portfolio non trovato' });
        }

        if (item.images && item.images.length > 0) {
            const publicIds = item.images.map(img => {
                const parts = img.src.split('/');
                const fileNameWithFolder = parts.slice(parts.indexOf('azzurra-makeup')).join('/').split('.')[0];
                return fileNameWithFolder;
            }).filter(id => id);

            if (publicIds.length > 0) {
                await cloudinary.api.delete_resources(publicIds);
            }
        }

        res.status(200).json({ message: 'Elemento del portfolio eliminato con successo' });
    } catch (error) {
        console.error("Errore nell'eliminazione:", error);
        res.status(500).json({ message: 'Errore nell\'eliminazione dell\'elemento del portfolio', error });
    }
};