import express from "express";
import { authenticateUser } from "../src/midelware/authMiddleware";

const router = express.Router();

//importation pour les routes
import usersAction from "./modules/users/usersAction";

//creation d'un user
router.post("/api/user", usersAction.register);
//récuperezr un user
router.get("/api/user/profile/:id", authenticateUser, usersAction.readUser);
//modifier les données de l'user
router.put("/api/user/update/:id", authenticateUser, usersAction.modif);
//suppression d'un utilisateur
router.delete("/api/user/delete/:id", authenticateUser, usersAction.Destroy);

//systeme d'auth
//login user
router.post("/api/user/login", usersAction.login);
router.post("/api/user/logout", usersAction.logout);

//importation pour les routes
import produitsAction from "./modules/produits/produitsAction";
// Définir des routes pour les produit

//ajouter un nouveau produit
router.post("/api/ajout/produit", authenticateUser, produitsAction.addProduit);
//modifier un produit
router.put(
	"/api/modifi/produit/:id",
	authenticateUser,
	produitsAction.modifProduit,
);
//supprimier un produit
router.delete(
	"/api/supprime/produit/:id",
	authenticateUser,
	produitsAction.suppProduit,
);
//recupérer un produit
router.get("/api/produit/:id", authenticateUser, produitsAction.readProduit);
//recupérer tous les produits
router.get("/api/produits/:id", authenticateUser, produitsAction.brows);
//recupérer tous les types et genres
router.get("/api/typegenre", produitsAction.readType);

//importation pour les routes
import shoppingListAction from "./modules/shoppingList/shoppingListAction";
//ajouter un nouveau shoppingList
router.post(
	"/api/shopping-list",
	authenticateUser,
	shoppingListAction.addToShoppingList,
);
//valider le produit pour l'ajouter dans le stock
router.post(
	"/api/shopping-list/validate/:id",
	authenticateUser,
	shoppingListAction.validateProduct,
);
//recupérer les produit
router.get("/api/affiche/shoppingList/:id", shoppingListAction.browsShoppingL);
//supprimer un produit de la list
router.delete(
	"/api/delete/shoppingList/:id",
	authenticateUser,
	shoppingListAction.suppShoppinList,
);

//scraping
import scrapCarrefourAction from "./modules/scraoing/carrefour/scrapCarrefourAction";

//scrapCarrefour
router.get("/api/scrap/carrefour", scrapCarrefourAction.scrapAndSaveCarrefour);
//recupération des données pour le front
router.get("/api/promos/carrefour", scrapCarrefourAction.brows);

import scrapAuchanAction from "./modules/scraoing/auchan/scrapAuchanAction";
//scrapAuchan
router.get("/api/scrap/Auchan", scrapAuchanAction.scrapAndSaveAuchan);
//recupération des données pour le front
router.get("/api/promos/Auchan", scrapAuchanAction.brows);


export default router;
