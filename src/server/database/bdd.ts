// server/database.ts
import mysql from 'mysql2';
import dotenv from 'dotenv';

// Charger les variables d'environnement depuis un fichier .env
dotenv.config();

console.log('DB_USER:', process.env.DB_USER); // Debug : affiche l'utilisateur
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);

// Créer une connexion à la base de données
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
});

// Vérifier si la connexion fonctionne
connection.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err.stack);
    return;
  }
  console.log('Connexion à la base de données réussie');
});

export default connection;