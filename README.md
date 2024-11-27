Backend Project

Prérequis

Node.js : Installation Node.js
MongoDB : si MongoDB est installé et en cours d'exécution sur la machine ou l'utilisation un service en ligne.
npm : Le gestionnaire de paquets pour Node.js.

Installez les dépendances :
bash
Copier le code
---  npm install

MONGO_URI=mongodb://localhost:27017/(votreBaseDeDonnees)
PORT=3100
Démarrage du projet
Lancer l'API :

---  npx ts-node src/app.ts
Cela démarrera le serveur sur le port défini dans  .env (par défaut PORT=3100).

Commandes d'Importation dans MongoDB pour les produits et les ventes associer 

---  mongoimport --uri mongodb://localhost:27017/(votreBaseDeDonnees) --collection produits --file ./path/to/products.json --jsonArray
Cela importera les données du fichier products.json dans la collection produits de la base de données MongoDB.

---  mongoimport --uri mongodb://localhost:27017/(votreBaseDeDonnees) --collection ventes --type csv --file ./path/to/sales.csv --headerline
Cela importera les données du fichier sales.json dans la collection sales de la base de données MongoDB.

Routes de l'API
1. GET /products
Retourne une liste des produits avec leurs données de ventes.

2. GET /analytics/total_sales
Retourne le montant total des ventes pour une période donnée.

Paramètre :

period: La période (par exemple, 7d, 30d, 12m).
3. GET /analytics/trending_products
Retourne les 5 produits les plus vendus.

4. GET /analytics/category_sales
Retourne la répartition des ventes par catégorie avec les pourcentages.

pour le Tests j'utilise
Postman 
