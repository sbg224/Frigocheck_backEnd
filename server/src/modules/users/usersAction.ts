import usersRepositorie from "./usersRepositorie";
import bcrypt from "bcrypt";
import { type thingsUsers, thingsProduct, thingsOrder } from "../../things";
import type { RequestHandler } from "express";

const add: RequestHandler = async (req, res) => {
	try {
		const { firstname, lastname, email, password, birth_day } = req.body;
		console.info(req.body);
		// Validation des entrées
		if (!firstname || !lastname || !email || !password || !birth_day) {
			res
				.status(400)
				.json({ error: "Tous les champs obligatoires doivent être remplis." });
			return;
		}

    console.log("🔍 Vérification de l'existence de l'utilisateur...");
		const userExit = await usersRepositorie.findEmail(email);
    console.log("Résultat de findEmail :", userExit);
		if (userExit) {
			res
				.status(409)
				.json({ error: "Un utilisateur avec cet email existe déjà." });
        return;
		}

		const hachPassword = bcrypt.hashSync(password, 10);

		const newUser: thingsUsers = {
			firstname,
			lastname,
			email,
			password: hachPassword,
			birth_day,
			id: 0,
		};

		const insert = await usersRepositorie.create(newUser);

		// ✅ Vérification si l'utilisateur a bien été ajouté
		if (!insert) {
			res.status(500).json({
				error: "Échec de l'ajout de l'utilisateur.",
			});
			return;
		}

		console.log("✅ Utilisateur ajouté avec succès, ID :", insert);
		res.status(201).json({
			message: "Utilisateur ajouté avec succès",
			userId: insert, // Retourne l'ID du nouvel utilisateur
		});
	} catch (error) {
		console.error("Erreur lors de l'ajout d'un utilisateur :", error);
		res.status(500).json({
			error: "Une erreur est survenue lors de l'ajout de l'utilisateur",
		});
	}
};

const modif: RequestHandler = async (req, res) => {
	const user_id = req.params.id;
	const { firstname, lastname, email, password, birth_day } = req.body;

	// Vérifier si req.body est vide
	if (Object.keys(req.body).length === 0) {
		res.status(400).json({ error: "Vous devez modifier au moins un champ" });
		return;
	}
	// Création d'un objet avec uniquement les champs fournis
	const updatedFields: Partial<thingsUsers> = {};
	if (firstname) updatedFields.firstname = firstname;
	if (lastname) updatedFields.lastname = lastname;
	if (email) updatedFields.email = email;
	if (password) updatedFields.password = bcrypt.hashSync(password, 10); // Hachage du mot de passe
	if (birth_day) updatedFields.birth_day = birth_day;

	try {
		console.log("🛠 Mise à jour de l'utilisateur :", user_id);
		const userUpdate = await usersRepositorie.update(user_id, updatedFields);

		console.info("Résultat de la mise à jour :", userUpdate);
		if (!userUpdate) {
			res.status(404).json({ error: "Utilisateur non trouvé" });
			return;
		}

		console.log("✅ Réponse envoyée !");
		res.status(200).json({ message: "Mise à jour effectuée avec succès" });
	} catch (error) {
		console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
		res.status(500).json({ error: "Erreur serveur lors de la mise à jour" });
		return;
	}
};

const Destroy: RequestHandler = async (req, res) => {
	const userId = req.params.id;
	// Vérifier que l'ID est valide
	if (!userId || Number.isNaN(Number(userId))) {
		console.error(`❌ Erreur : ID utilisateur invalide : ${userId}`);
		res.status(400).json({ error: "ID utilisateur invalide" });
		return;
	}

	try {
		const deleteUser = await usersRepositorie.delete(userId);

		// Si aucune ligne n'a été affectée, cela signifie que l'utilisateur n'a pas été trouvé
		if (deleteUser === 0) {
			console.warn(`⚠️ Aucun utilisateur trouvé avec l'ID : ${userId}`);
			res.status(404).json({ error: "Utilisateur non trouvé" });
			return;
		}

		// Si la suppression a réussi
		console.log(`✅ Utilisateur avec l'ID : ${userId} supprimé avec succès`);
		res.status(200).json({ message: "Utilisateur supprimé avec succès" });
		return;
	} catch (error) {
		console.error("Erreur lors de la suppression de l'utilisateur :", error);
		res.status(500).json({ error: "Erreur serveur lors de la suppression" });
		return;
	}
};

export default { add, modif, Destroy };
