import produitsRepositorie from "./produitsRepositorie";
import {
	type thingsUsers,
	type thingsProduct,
	thingsOrder,
} from "../../things";
import type { RequestHandler, NextFunction } from "express";

//ajoputer un produit
const addProduit: RequestHandler = async (req, res) => {
	try {
    console.log("📩 Requête reçue pour ajouter un produit !");
		console.log("📝 Corps de la requête :", req.body);
		const { designation, user_id, type_id, genre_id, quantite } = req.body;
		console.info(req.body);

		// Validation des entrées
		if (!designation || !user_id || !type_id || !genre_id || !quantite) {
			res
				.status(400)
				.json({ error: "Tous les champs obligatoires doivent être remplis." });
			return;
		}

		const produitInsert = await produitsRepositorie.create({
			designation,
			user_id,
			type_id,
			genre_id,
			quantite,
			id: 0,
		});

    if (!produitsRepositorie) {
      console.error("🛑 Erreur : Repository non initialisé.");
      res.status(500).json({ error: "Problème avec la connexion à la base de données." });
      return;
  }

		// ✅ Vérification si l'produit a bien été ajouté
		if (!produitInsert) {
			res.status(500).json({
				error: "Échec de l'ajout du produit.",
			});
			return;
		}

		console.log("✅ produit ajouté avec succès, ID :", produitInsert);
		res.status(201).json({
			message: "produit ajouté avec succès",
			ProductId: produitInsert, // Retourne l'ID du nouvel produit
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout d'un produit :", error);
		res.status(500).json({
			error: "Une erreur est survenue lors de l'ajout de produit",
		});
	}
};


//modifier un produit
const modifProduit: RequestHandler = async (req, res) => {
	const product_id = req.params.id;
	const { designation, user_id, type_id, genre_id, quantite } = req.body;

	// Vérifier si req.body est vide
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ error: "Vous devez modifier au moins un champ" });
		return;
	}

	// Création d'un objet avec uniquement les champs fournis
	const updatedProduit: Partial<thingsProduct> = {};
	if (designation) updatedProduit.designation = designation;
	if (user_id) updatedProduit.user_id = user_id;
	if (type_id) updatedProduit.type_id = type_id;
	if (genre_id) updatedProduit.genre_id = genre_id;
	if (quantite) updatedProduit.quantite = quantite;

	try {
		console.log("🛠 Mise à jour du produit :", product_id);
		const productUpdate = await produitsRepositorie.update(
			product_id,
			updatedProduit,
		);
		console.info("Résultat de la mise à jour :", productUpdate);
		if (!productUpdate) {
			res.status(404).json({ error: "produit non trouvé" });
			return;
		}

		console.log("✅ Réponse envoyée !");
		res.status(200).json({ message: "Mise à jour effectuée avec succès" });
	} catch (error) {
		console.error("Erreur lors de la mise à jour du produit :", error);
		res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
		return;
	}
};

//supprimer un produit
const suppProduit: RequestHandler = async (req, res) => {
	const product_id = req.params.id;

	// Vérifier que l'ID est valide
	if (!product_id || Number.isNaN(Number(product_id))) {
		console.error(`❌ Erreur : ID produit invalide : ${product_id}`);
		res.status(400).json({ error: "ID produit invalide" });
		return;
	}

	try {
		const deleteProduct = await produitsRepositorie.delete(product_id);

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

//recupérer un produit par l'id 
const readProduit: RequestHandler = async (req, res, next) => {
	const product_id = req.params.id;
	try {
		const getOne = await produitsRepositorie.read(product_id);

		if (!getOne) {
			res.status(404).json({ message: "produit non trouvé" });
			return;
		}

		res.status(200).json({ message: getOne });
	} catch (error) {
		next(error);
	}
};

//recupérer tous les produit
const brows: RequestHandler = async (req, res, next) => {
	const id = req.params.id
	try {
		const getAll = await produitsRepositorie.readAll(id);

		if (!getAll) {
			res.status(404).json({ message: "produit non trouvé" });
			return;
		}

		res.status(200).json({ data: getAll || [] });
	} catch (error) {
		next(error);
	}
};

//recupérer tous les types et les genres
const readType: RequestHandler = async (req, res, next) => {
	try {
		const typesAndGenres = await produitsRepositorie.readTypesAndGenres();
		console.log(typesAndGenres);
		
		if (!typesAndGenres) {
			res.status(404).json({ message: "produit non trouvé" });
			return;
		}

		res.status(200).json({ message: typesAndGenres });
	} catch (error) {
		next(error);
	}
};

export default { addProduit, modifProduit,suppProduit, readProduit, brows, readType };
