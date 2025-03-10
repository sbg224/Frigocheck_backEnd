import connection from "../database/bdd";
import router from "./routes";
import express from "express";
import cors from "cors";

const app = express();
// Middleware pour CORS
app.use(cors());

// Middleware pour parser le corps des requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Utiliser le routeur
app.use(router);
// Vérification de la connexion à la base de données
// connection.connect((err) => {
// 	if (err) {
// 		console.error("Erreur de connexion à la base de données: ", err.stack);
// 		return;
// 	}
// 	console.log("Connecté à la base de données avec succès");
// });

const port = process.env.PORT || 3000;

// Démarrer le serveur
app.listen(port, () => {
	console.log(`Serveur démarré sur le port ${port}`);
});
