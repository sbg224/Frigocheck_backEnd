import { pool } from "database/bdd";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import type { thingsProduct } from "../../things";

class ShoppingListRepository {
	async findProduct(designation: thingsProduct, user_id: number) {
		//je verifie si le produit existe deja
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					"SELECT id, designation, user_id, type_id, genre_id, quantite FROM produit WHERE designation = ? AND user_id = ? LIMIT 1",
					[designation, user_id],
				);
			console.log("Résultat de la recherche :", rows);

			if (rows.length > 0) {
				return rows[0] as thingsProduct;
				// throw new Error("Un utilisateur avec cet email existe déjà.");
			}
			return null;
		} catch (error) {}
	}

	async addToShoppingList(product: thingsProduct): Promise<number> {
		try {
			const [rows] = await pool
				.promise()
				.query<ResultSetHeader>(
					"INSERT INTO shopping_list (designation, user_id, type_id, genre_id, quantite) VALUES (?, ?, ?, ?, ?)",
					[
						product.designation,
						product.user_id,
						product.type_id,
						product.genre_id,
						product.quantite,
					],
				);

			if (rows.affectedRows === 0) {
				throw new Error("Échec de l'ajout à la liste de courses.");
			}
			return rows.insertId;
		} catch (error) {
			console.error("Erreur lors de l'ajout à la liste de courses :", error);
			throw error;
		}
	}


	async validateProduct(product_id: number): Promise<number> {
		try {
			// Récupérer le produit à valider
			const [productRows] = await pool
				.promise()
				.query<RowDataPacket[]>("SELECT * FROM shopping_list WHERE id = ?", [
					product_id,
				]);

			if (productRows.length === 0) {
				throw new Error("Produit non trouvé dans la liste de courses.");
			}
			const product = productRows[0];

			// Insérer dans la table `produit`
			const [insertRows] = await pool
				.promise()
				.query<ResultSetHeader>(
					"INSERT INTO produit (designation, user_id, type_id, genre_id, quantite) VALUES (?, ?, ?, ?, ?)",
					[
						product.designation,
						product.user_id,
						product.type_id,
						product.genre_id,
						product.quantite,
					],
				);

			if (insertRows.affectedRows === 0) {
				throw new Error("Échec de la validation du produit.");
			}

			// Supprimer de `shopping_list_items`
			await pool
				.promise()
				.query<ResultSetHeader>("DELETE FROM shopping_list WHERE id = ?", [
					product_id,
				]);

			return insertRows.insertId;
		} catch (error) {
			console.error("Erreur lors de la validation du produit :", error);
			throw error;
		}
	}

	async readAll() {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>("SELECT * FROM shopping_list");
			console.log("Résultat :", rows);
			if (rows.length > 0) {
				return rows; // Retourner le tableau complet
			}
			return null;
		} catch (error) {}
	}

	//function pour supprimer un produit
	async delete(product_id: string): Promise<number> {
		try {
			const [rows] = await pool
				.promise()
				.query<ResultSetHeader>("DELETE from shopping_list WHERE id = ?", [
					product_id,
				]);
			return rows.affectedRows;
		} catch (error) {
			console.error({
				message: "Erreur lors de la suppression de produit :",
				error,
			});
			throw error;
		}
	}
}

export default new ShoppingListRepository();
