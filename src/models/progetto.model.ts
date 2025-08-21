import mongoose, { Document, Schema } from 'mongoose';

// Interfaccia per le immagini della galleria
export interface IPortfolioImage {
  src: string;
  description?: string;
  alt?: string;
  isNew?: boolean; // Usato solo dal frontend, non salvato nel DB
}

// Interfaccia per l'elemento del portfolio
export interface IPortfolioItem extends Document {
  title: string;
  subtitle?: string;
  description?: string;
  category: string;
  images: IPortfolioImage[];
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioImageSchema: Schema = new Schema({
  src: { type: String, required: true },
  description: { type: String },
  alt: { type: String }
}, { _id: false });

const PortfolioItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  description: { type: String },
  category: { type: String, required: true },
  images: [PortfolioImageSchema]
}, {
  timestamps: true // Aggiunge createdAt e updatedAt
});

export const PortfolioItem = mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);