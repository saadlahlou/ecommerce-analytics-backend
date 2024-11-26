import express, { Request, Response } from 'express';
import Product from '../models/product'; // Assurez-vous que le modèle `Product` correspond à votre schéma MongoDB

const router = express.Router();

// Route pour afficher tous les produits
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // Récupération de tous les produits dans la base de données
    const products = await Product.find({}, { _id: 0}); // si on veux exclure `_id` {.}

    if (products.length === 0) {
      res.status(404).json({ message: 'Aucun produit trouvé dans la base de données.' });
      return;
    }

    
    res.json(products);
  } catch (error) {
    console.error('Erreur détectée lors de la récupération des produits :', error);

    res.status(500).json({
      message: 'Une erreur interne est survenue.',
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default router;
