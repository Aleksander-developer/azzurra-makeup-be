// src/models/progetto.model.ts (PortfolioItem)
import mongoose, { Document, Schema } from 'mongoose';

// Interfaccia per le immagini della galleria
export interface IPortfolioImage {
  src: string;
  description?: string;
  alt?: string;
  isNew?: boolean; // Indica se l'immagine è stata appena caricata
}

// Interfaccia per l'elemento del portfolio
export interface IPortfolioItem extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  images?: IPortfolioImage[]; // Array di immagini della galleria
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioImageSchema: Schema = new Schema(
  {
    src: { type: String, required: true },
    description: { type: String },
    alt: { type: String },
  },
  { _id: false } // evita _id per ogni sub-documento
);

const PortfolioItemSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String },
    category: { type: String, required: true },
    images: [PortfolioImageSchema],
  },
  {
    timestamps: true, // aggiunge createdAt e updatedAt
  }
);

export const PortfolioItem = mongoose.model<IPortfolioItem>(
  'PortfolioItem',
  PortfolioItemSchema
);
