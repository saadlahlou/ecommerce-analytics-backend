import mongoose, { Schema, Document } from 'mongoose';

// Définition de l'interface TypeScript pour le produit
export interface Product extends Document {
  ProductID: number;
  ProductName: string;
  Category: string;
  Price: number;
}

// Définition du schéma Mongoose pour le produit
const productSchema: Schema = new Schema({
  ProductID: { type: Number, required: true, unique: true }, //L'AJOUT de lunicité SI on veut
  ProductName: { type: String, required: true },             
  Category: { type: String, required: true },                
  Price: { type: Number, required: true },                   
});

// Création du modèle Mongoose pour le produit
const Product = mongoose.model<Product>('Product', productSchema);

export default Product;
