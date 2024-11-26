import express, { Request, Response } from 'express';
import Sale from '../models/sale';

const router = express.Router();

// GET /sales : Retourne une liste de toutes les ventes avec une limite de 100
router.get('/', async (req: Request, res: Response) => {
  try {
    // Récupérer les ventes avec les détails de ProductID
    const sales = await Sale.find()
      .populate('ProductID') // Charge les informations associées à ProductID
      .limit(100);

    if (sales.length === 0) {
      res.status(404).json({ message: 'Aucune vente trouvée' });
    } else {
      // Formater les données
      const formattedSales = sales.map(sale => ({
        ...sale.toObject(), // Convertir en objet JSON
        Date: sale.Date.toISOString().split('T')[0], // Formater la date
      }));

      res.json(formattedSales);
    }
  } catch (error) {
    res.status(500).json({
      message: 'Erreur lors de la récupération des ventes',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    });
  }
});

export default router;
