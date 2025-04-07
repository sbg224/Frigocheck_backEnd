import type { RequestHandler } from "express";
import ShoppingListRepository from "./shoppingListRepositorie";
import { thingsProduct } from "../../things";
import shoppingListRepositorie from "./shoppingListRepositorie";
import produitsRepositorie from "../produits/produitsRepositorie";

// Ajouter un produit à la liste de courses
const addToShoppingList: RequestHandler = async (req, res) => {
	try {
		const { designation, user_id, type_id, genre_id, quantite } = req.body;

		if (!designation || !user_id || !type_id || !genre_id || !quantite) {
			res.status(400).json({ error: "Tous les champs sont obligatoires." });
			return;
		}

    		// Vérifier si le produit existe déjà dans le stock
		const existingInStock = await produitsRepositorie.findProduct(
			designation,
			user_id,
		);
		console.log("Résultat de findProduct dans le stock:", existingInStock);

		if (existingInStock) {
			// Si le produit existe déjà dans le stock, informer l'utilisateur
			res.status(409).json({
				error: "Ce produit existe déjà dans votre stock.",
				productId: existingInStock.id,
				currentQuantity: existingInStock.quantite,
				action: "exists_in_stock",
			});
			return;
		}

		// Vérifier si le produit existe déjà dans la liste de courses
		const existingInShoppingList = await shoppingListRepositorie.findProduct(
			designation,
			user_id,
		);
		console.log(
			"Résultat de findProduct dans la liste de courses:",
			existingInShoppingList,
		);

		if (existingInShoppingList) {
			// Si le produit existe déjà dans la liste de courses, proposer de mettre à jour la quantité
			res.status(409).json({
				error: "Ce produit existe déjà dans votre liste de courses.",
				productId: existingInShoppingList.id,
				currentQuantity: existingInShoppingList.quantite,
				action: "update_stock_quantity",
			});
			return;
		}

		const productInsert = await ShoppingListRepository.addToShoppingList({
			designation,
			user_id,
			type_id,
			genre_id,
			quantite,
			id: 0,
		});

		res.status(201).json({
			message: "Produit ajouté à la liste de courses avec succès",
			productId: productInsert,
		});
	} catch (error) {
		res
			.status(500)
			.json({ error: "Erreur lors de l'ajout à la liste de courses" });
	}
};

// Valider un produit et l'ajouter au stock
const validateProduct: RequestHandler = async (req, res) => {
	try {
		const product_id = req.params.id;

		if (!product_id) {
			res.status(400).json({ error: "ID du produit requis." });
			return;
		}

		const validatedProductId = await ShoppingListRepository.validateProduct(
			Number(product_id),
		);

		res.status(200).json({
			message: "Produit validé et ajouté au stock avec succès",
			productId: validatedProductId,
		});
	} catch (error) {
		res.status(500).json({ error: "Erreur lors de la validation du produit" });
	}
};

const browsShoppingL: RequestHandler = async (req, res, next) => {
  const id = req.params.id
  try {
    const getAll = await shoppingListRepositorie.readAll(id);

    // Renvoyer une liste vide au lieu d'une erreur 404
    res.status(200).json({ data: getAll || [] });
  } catch (error) {
    next(error);
  }
};

//supprimer un produit
const suppShoppinList: RequestHandler = async (req, res) => {
	const product_id = req.params.id;

	// Vérifier que l'ID est valide
	if (!product_id || Number.isNaN(Number(product_id))) {
		console.error(`❌ Erreur : ID produit invalide : ${product_id}`);
		res.status(400).json({ error: "ID produit invalide" });
		return;
	}

	try {
		const deleteProduct = await shoppingListRepositorie.delete(product_id);

		if (deleteProduct === 0) {
			console.warn(`⚠️ Aucun produit trouvé avec l'ID : ${product_id}`);
			res.status(404).json({ error: "produit non trouvé" });
			return;
		}
		// Si la suppression a réussi
		console.log(`✅ produit avec l'ID : ${product_id} supprimé avec succès`);
		res.status(200).json({ message: "produit supprimé avec succès" });
		return;
	} catch (error) {
		console.error("Erreur lors de la suppression de l'produit :", error);
		res.status(500).json({ error: "Erreur serveur lors de la suppression" });
		return;
	}
};

export default {
	addToShoppingList,
	validateProduct,
	browsShoppingL,
	suppShoppinList,
};
