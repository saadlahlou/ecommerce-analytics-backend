import mongoose from 'mongoose';

// URL de connexion à MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce';

/**
 * Fonction pour connecter à la base de données MongoDB.
 */
export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI); // Connexion sans options supplémentaires
    console.log(`✅ Connecté à MongoDB : ${MONGO_URI}`);
  } catch (error) {
    console.error('❌ Erreur lors de la connexion à MongoDB:', error);
    throw error; 
  }
};
