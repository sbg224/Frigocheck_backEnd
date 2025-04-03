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
router.delete("/api/supprime/produit/:id", produitsAction.suppProduit)
//recupérer un produit
router.get("/api/produit/:id", produitsAction.readProduit)
//recupérer tous les produits
router.get("/api/produits", produitsAction.brows)
//recupérer tous les types et genres
router.get("/api/typegenre", produitsAction.readType)


//importation pour les routes
import shoppingListAction from "./modules/shoppingList/shoppingListAction";
//ajouter un nouveau shoppingList
router.post("/api/shopping-list", shoppingListAction.addToShoppingList);
//valider le produit pour l'ajouter dans le stock
router.post("/api/shopping-list/validate/:id", shoppingListAction.validateProduct)
//recupérer les produit
router.get("/api/affiche/shoppingList", shoppingListAction.browsShoppingL)
//supprimer un produit de la list 
router.delete("/api/delete/shoppingList/:id", shoppingListAction.suppShoppinList)



//systeme d'auth
//login user
router.post("/api/user/login", usersAction.login)
router.post("/api/user/logout", usersAction.logout)


export default router;
