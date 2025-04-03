// server/database.ts
import mysql from "mysql2";
import dotenv from "dotenv";

// Charger les variables d'environnement depuis un fichier .env
dotenv.config();

console.log("DB_USER:", process.env.DB_USER); // Debug : affiche l'utilisateur
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);

// Créer une connexion à la base de données
// Créer un pool de connexions à la base de données
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Stocker la clé secrète du JWT
const secret_key = process.env.JWT_SECRET || "default_secret"; // Valeur par défaut si non définie

export { secret_key, pool };
