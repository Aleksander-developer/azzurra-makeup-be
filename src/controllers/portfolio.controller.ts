import { Request, Response } from 'express';
import { PortfolioItem, IPortfolioImage } from '../models/progetto.model';
import cloudinary from '../config/cloudinary.config';

// Funzione helper per caricare un buffer su Cloudinary
const uploadToCloudinary = (buffer: Buffer, folder: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: folder, quality: "auto:low", fetch_format: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// GET tutti gli elementi
export const getPortfolioItems = async (_req: Request, res: Response) => {
  try {
    const items = await PortfolioItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero degli elementi', error });
  }
};

// GET un singolo elemento
export const getPortfolioItemById = async (req: Request, res: Response) => {
  try {
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Elemento non trovato' });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dell\'elemento', error });
  }
};

// POST Aggiungi un nuovo elemento
export const addPortfolioItem = async (req: Request, res: Response) => {
  try {
    const { title, category, subtitle, description } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const mainImageFile = files?.mainImage?.[0]; // <-- Prende l'immagine principale
    const galleryFiles = files?.galleryImages || [];
    const imagesData: IPortfolioImage[] = req.body.images ? JSON.parse(req.body.images) : [];

    if (!title || !category) {
      return res.status(400).json({ message: 'Titolo e Categoria sono obbligatori.' });
    }

    let mainImageUrl: string | undefined = undefined;
    if (mainImageFile) {
        const result = await uploadToCloudinary(mainImageFile.buffer, 'azzurra-makeup/portfolio-main');
        mainImageUrl = result.secure_url;
    }

    // Carica immagini della galleria
    const galleryImagesUrls: IPortfolioImage[] = [];
    const newImagesMetadata = imagesData.filter(d => d.isNew);
    for (let i = 0; i < galleryFiles.length; i++) {
      const file = galleryFiles[i];
      const result = await uploadToCloudinary(file.buffer, 'azzurra-makeup/portfolio-gallery');
      const imageDetails = newImagesMetadata[i]; 
      galleryImagesUrls.push({
        src: result.secure_url,
        description: imageDetails?.description || '',
        alt: imageDetails?.alt || ''
      });
    }

    const newItem = new PortfolioItem({
      title,
      subtitle,
      description,
      category,
      mainImage: mainImageUrl, // <-- Usa l'URL dell'immagine caricata
      images: galleryImagesUrls,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);

  } catch (error) {
    console.error("Errore nell'aggiunta:", error);
    res.status(500).json({ message: 'Errore nell\'aggiunta dell\'elemento del portfolio', error });
  }
};

// PUT Aggiorna un elemento
export const updatePortfolioItem = async (req: Request, res: Response) => {
    // Implementazione simile a 'addPortfolioItem' ma per l'aggiornamento
    // Per ora la lasciamo semplice per non creare confusione
    try {
        const { id } = req.params;
        const updatedItem = await PortfolioItem.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedItem) return res.status(404).json({ message: "Elemento non trovato" });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Errore nell'aggiornamento dell'elemento", error });
    }
};

// DELETE Elimina un elemento
export const deletePortfolioItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedItem = await PortfolioItem.findByIdAndDelete(id);
        if (!deletedItem) return res.status(404).json({ message: "Elemento non trovato" });
        // Qui andrebbe la logica per eliminare le immagini da Cloudinary
        res.json({ message: "Elemento eliminato con successo" });
    } catch (error) {
        res.status(500).json({ message: "Errore nell'eliminazione dell'elemento", error });
    }
};