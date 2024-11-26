import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDatabase } from './database';
import analyticsRoutes from './routes/analytics';
import productsListesRoutes from './routes/productsListes'; 
import salesListesRoutes from './routes/salesListes';
import productRoutes from './routes/products' 

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middleware global pour CORS (Contrôle d'accès)
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
  }));
  

// Middleware pour analyser le corps des requêtes JSON
app.use(express.json());

// Définition des routes
app.use('/analytics', analyticsRoutes);
app.use('/productsListes', productsListesRoutes);  
app.use('/salesListes', salesListesRoutes);
app.use('/products', productRoutes);  

// Middleware pour gérer les erreurs non capturées
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erreur interceptée:', err.stack);
  res.status(500).json({ error: 'Une erreur interne est survenue.' });
});

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Connexion à la base de données MongoDB avant de démarrer le serveur
    await connectDatabase();
    console.log('✅ Base de données connectée, démarrage du serveur...');

    // Démarrage du serveur sur le port défini ou 3100 par défaut
    const PORT = process.env.PORT || 3100;
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Échec de la connexion à la base de données ou du démarrage du serveur:', error);

  }
};

// Démarrer le serveur
startServer();

export default app;
