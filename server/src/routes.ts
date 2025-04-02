import express from "express";

const router = express.Router();

//importation pour les routes
import usersAction from './modules/users/usersAction';

//creation d'un user
router.post("/api/user", usersAction.add);
//modifier les données de l'user
router.put("/api/user/update/:id", usersAction.modif);
//suppression d'un utilisateur
router.delete("/api/user/delete/:id" , usersAction.Destroy)


//importation pour les routes
import produitsAction from "./modules/produits/produitsAction";
// Définir des routes pour les produit

//ajouter un nouveau produit
router.post("/api/ajout/produit", produitsAction.addProduit)
//modifier un produit
router.put("/api/modifi/produit/:id", produitsAction.modifProduit)
//supprimier un produit
router.delete("/api/upprime/produit/:id", produitsAction.suppProduit)
//recupérer un produit
router.get("/api/produit/:id", produitsAction.readProduit)
//recupérer tous les produits
router.get("/api/produit", produitsAction.brows)



export default router;
