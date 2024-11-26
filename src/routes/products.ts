import express, { Request, Response } from 'express';
import Product from '../models/product';
import Sale from '../models/sale';

const router = express.Router();

// Route GET /products : Retourne une liste des produits avec leurs données de ventes
router.get('/', async (req: Request, res: Response) => {
  try {
    // Récupération des produits
    const products = await Product.find();

    // Agrégation des données de ventes pour chaque produit
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: "$ProductID", // Grouper par ProductID
          totalQuantity: { $sum: "$Quantity" }, // Total des quantités vendues
          totalSalesAmount: { $sum: "$TotalAmount" }, // Total des montants
          firstSaleDate: { $min: "$Date" } // Première date de vente comme date d'ajout
        }
      }
    ]);

    // Fusion des données des produits avec les ventes
    const result = products.map(product => {
      const saleData = sales.find(sale => sale._id?.toString() === product.ProductID.toString());

      return {
        productId: product.ProductID,
        productName: product.ProductName,
        category: product.Category,
        price: product.Price,
        addedDate: saleData?.firstSaleDate || new Date(), // J'Utilise la première date de vente ou la date actuelle si aucune vente
        quantitySold: saleData?.totalQuantity || 0, // Quantité vendue (par défaut : 0)
        totalSalesAmount: saleData?.totalSalesAmount || 0 // Montant total des ventes (par défaut : 0)
      };
    });

    res.status(200).json(result);

  } catch (error) {
    console.error("Erreur lors de la récupération des produits ou des ventes :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
});

export default router;
