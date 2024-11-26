  import express, { Request, Response } from 'express';
  import Sale from '../models/sale';
 
  const router = express.Router();


// Endpoint GET /analytics/total_sales : Retourne le montant total des ventes pour la période sélectionnée
router.get('/total_sales', async (req: Request, res: Response) => {
  // Récupère la période à partir des paramètres de la requête, avec une valeur par défaut de '30d'
  const period = req.query.period as string || '30d';

  // Fonction pour déterminer la date de début de la période en fonction du paramètre 'period'
  const getDateFilter = (period: string): Date | null => {
    const now = Date.now();
    switch (period) {
      case '7d': // Derniers 7 jours
        return new Date(now - 7 * 24 * 60 * 60 * 1000);
      case '30d': // Derniers 30 jours
        return new Date(now - 30 * 24 * 60 * 60 * 1000);
      case '12m': // Derniers 12 mois
        const date = new Date();
        date.setFullYear(date.getFullYear() - 1); // Moins 1 an
        return date;
      default:
        return null; // Retourne null si la période est invalide
    }
  };

  try {
    // Obtenir la date de filtre basée sur la période choisie
    const dateFilter = getDateFilter(period);

    // Vérifie si le filtre est valide, sinon renvoie une erreur
    if (!dateFilter || isNaN(dateFilter.getTime())) {
      res.status(400).json({ error: 'Période invalide. Choisissez parmi 7d, 30d, ou 12m.' });
    }

    // Agréger les ventes en fonction de la période et calculer le montant total
    const totalSales = await Sale.aggregate([
      {
        // Ajouter un champ 'parsedDate' pour convertir le champ Date en un objet Date pour la comparaison
        $addFields: { parsedDate: { $toDate: '$Date' } },
      },
      {
        // Filtrer les ventes selon la période spécifiée
        $match: { parsedDate: { $gte: dateFilter } },
      },
      {
        // Calculer le montant total des ventes (Quantity * TotalAmount)
        $project: { totalAmount: { $multiply: ['$Quantity', '$TotalAmount'] } },
      },
      {
        // Additionner les montants totaux des ventes
        $group: { _id: null, totalSalesAmount: { $sum: '$totalAmount' } },
      },
    ]);

    // Si des ventes existent, retourner le montant total, sinon retourner 0
    const totalAmount = totalSales.length > 0 ? totalSales[0].totalSalesAmount : 0;
    res.json({ totalSalesAmount: totalAmount });

  } catch (error) {
    // En cas d'erreur interne, gérer l'exception et renvoyer un message d'erreur
    console.error('Erreur lors de la récupération des ventes :', error);
    res.status(500).json({
      message: 'Une erreur inconnue est survenue.',
      error: error instanceof Error ? error.message : 'Erreur interne',
    });
  }
});


// GET /analytics/trending_products : Retourne les 5 produits les plus vendus
router.get('/trending_products', async (req: Request, res: Response) => {
  try {
    // Utilisation de l'agrégation MongoDB pour récupérer les 5 produits les plus vendus
    const trendingProducts = await Sale.aggregate([
      {
        $group: {
          _id: '$ProductID', // Groupement par identifiant produit
          totalQuantitySold: { $sum: '$Quantity' }, // Calcul de la quantité totale vendue
        },
      },
      { 
        $sort: { totalQuantitySold: -1 } }, // Tri par quantité vendue (ordre décroissant)
      { 
        $limit: 5 }, // Limite à 5 produits
      {
        $lookup: {
          from: 'products', // Jointure avec la collection des produits
          localField: '_id',
          foreignField: 'ProductID',
          as: 'productDetails',
        },
      },
      { $unwind: '$productDetails' }, // Décompose le tableau produit en un objet individuel
      {
        $project: {
          _id: 0, // Exclut l'_id du produit agrégé
          productName: '$productDetails.ProductName', // Nom du produit
          quantitySold: '$totalQuantitySold', // Quantité vendue
          totalSalesAmount: { 
            $multiply: ['$totalQuantitySold', '$productDetails.Price'], // Montant total des ventes
          },
        },
      },
    ]);

    // Si aucun produit n'est trouvé, renvoie une réponse 404
    if (trendingProducts.length === 0) {
      res.status(404).json({ message: 'Aucun produit vendu trouvé.' });
    }

    // Réponse avec les produits les plus vendus
    res.json(trendingProducts);

  } catch (error) {
    // Gestion des erreurs
    res.status(500).json({
      message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue.',
    });
  }
});


  // GET /analytics/category_sales : Retourne la répartition des ventes par catégorie
  router.get('/category_sales', async (req: Request, res: Response) => {
    try {
      const categorySales = await Sale.aggregate([
        {
          $lookup: {
            from: 'products', // Jointure avec la collection `products`
            localField: 'ProductID', // Correspond au champ utilisé dans `Sale` pour référencer un produit
            foreignField: 'ProductID', // Champ utilisé dans `products` comme clé primaire
            as: 'productDetails',
          },
        },
        { $unwind: '$productDetails' }, // ON decompose le tableau `productDetails`
        {
          $group: {
            _id: '$productDetails.Category', // Regroupement par catégorie
            totalSales: { $sum: '$Quantity' }, // Calcul du total des quantités vendues
          },
        },
      ]);

      if (categorySales.length === 0) {
        res.status(404).json({ message: 'Aucune vente trouvée pour les catégories.' });
        return;
      }

      // Calcule le total global des ventes
      const totalSales = categorySales.reduce((sum, category) => sum + category.totalSales, 0);

      // Calcule de pourcentage des ventes par catégorie
      const result = categorySales.map((category) => ({
        category: category._id,
        totalSales: category.totalSales,
        percentage: ((category.totalSales / totalSales) * 100).toFixed(2), // Pourcentage avec 2 décimales
      }));

      res.json(result);
    } catch (error) {
      console.error('Erreur dans /category_sales:', error);
      res.status(500).json({
        message: error instanceof Error ? error.message : 'Une erreur inconnue est survenue.',
      });
    }
  });




export default router;  //  pour exporter les routs par defaut via app.ts