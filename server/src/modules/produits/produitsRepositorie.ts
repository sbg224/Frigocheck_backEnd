import pool from "database/bdd";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { thingsUsers, type thingsProduct, thingsOrder } from "../../things";

class produitsRepositorie {

  async findProduct(designation: string) {
		//je verifie si l'utilisateur existe deja
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					"SELECT id, designation, user_id, type_id, genre_id, quantite FROM produit WHERE designation = ? LIMIT 1",
					[designation],
				);
        console.log("Résultat de la recherche :", rows);

			if (rows.length > 0) {
        return rows[0] as thingsProduct;
				// throw new Error("Un utilisateur avec cet email existe déjà.");
			}
      return null;
		} catch (error) {

    }
	}

	// Ajout d'un produit
	async create(product: thingsProduct): Promise<number> {
		try {
			const [rows] = await pool
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

        if (!pool) {
          console.error("🛑 ERREUR: La connexion MySQL (pool) n'est pas initialisée !");
          throw new Error("Problème de connexion à la base de données.");
      }
			// Vérification si l'insertion a réussi
			if (rows.affectedRows === 0) {
				throw new Error("Aucune ligne affectée lors de l'insertion.");
			}

			// Retourner l'ID de l'utilisateur inséré
			return rows.insertId;
		} catch (error) {
			console.error({
				message: "Erreur lors de l'ajout d'un produit :",
				error,
			});
			throw error; // Relancer l'erreur pour la gestion en amont
		}
	}

  //function pour modifier un produit
	async update(
		product_id: string,
		product: Partial<thingsProduct>,
	): Promise<number> {
		try {
			console.log("🔍 Début de la mise à jour SQL pour produit :", product_id);

			const [rows] = await pool
				.promise()
				.query<ResultSetHeader>(
					"UPDATE produit SET designation = ?, user_id = ?, type_id =?, genre_id =?, quantite = ? WHERE id = ?",
					[
						product.designation,
						product.user_id,
						product.type_id,
						product.genre_id,
						product.quantite,
						product_id,
					],
				);
			console.log("📌 Résultat SQL :", rows);

			// Vérification si la mise à jour a bien eu lieu
			if (rows.affectedRows === 0) {
				throw new Error(
					"Aucun utilisateur trouvé avec cet ID, ou aucune modification effectuée.",
				);
			}

			// Retourner le nombre de lignes affectées
			return rows.affectedRows;
		} catch (error) {
			console.error({
				message: "Erreur lors de la mise à jour de produit :",
				error,
			});
			throw error;
		}
	}

  //function pour supprimer un produit
	async delete(product_id: string): Promise<number> {
		try {
			const [rows] = await pool
				.promise()
				.query<ResultSetHeader>("DELETE from produit WHERE id = ?", [
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


	async read(product_id: string) {
    try {
      const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
          "SELECT * FROM produit WHERE id = ?",[product_id]
        );
        console.log("Résultat :", rows);
        if (rows.length > 0) {
          return rows[0] as unknown as string;
        }
        return null;
    } catch (error) {
      
    }
  }

	async readAll() {
    try {
      const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
          "SELECT * FROM produit"
        );
        console.log("Résultat :", rows);
        if (rows.length > 0) {
          return rows[0] as unknown as string;
        }
        return null;
    } catch (error) {
      
    }
  };

  async readTypesAndGenres(){
    try {
      const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
          "SELECT t.id AS type_id, t.t_name AS type_name, g.id AS genre_id, g.g_name AS genre_name FROM `type` t CROSS JOIN genre g"
        );
        console.log("Résultat :", rows);
        return rows.length > 0 ? rows : null;
    } catch (error) {
      
    }
  }
}


export default new produitsRepositorie();
