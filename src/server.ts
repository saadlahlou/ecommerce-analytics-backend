import app from './app'; // Import de l'application Express depuis app.ts
import { connectDatabase } from './database'; // Connexion à la base de données

const PORT = process.env.PORT || 3100;

// Fonction pour démarrer le serveur
const startServer = async () => {
  try {
    // Connexion à la base de données via MongoDB
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    // Gestion des erreurs lors du démarrage du serveur
    console.error('❌ Échec du démarrage du serveur :', error); // POUR LES LOGO npm install figlet
  }
};

// Démarrer le serveur
startServer();
