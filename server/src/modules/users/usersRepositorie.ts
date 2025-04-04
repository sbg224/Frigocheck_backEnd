import {pool} from "database/bdd";
import type { ResultSetHeader, RowDataPacket } from "mysql2";
import { type thingsUsers, thingsProduct, thingsOrder } from "../../things";

class usersRepositorie {
	async findEmail(email: string) {
		try {
			const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
					"SELECT id, firstname, lastname, email, password, birth_day FROM `user` WHERE email = ? LIMIT 1",
					[email]
				);
	
			console.log("Résultat de la recherche :", rows);
	
			if (rows.length > 0) {
				return rows[0] as thingsUsers;
			}
			return null;
		} catch (error) {
			console.error("Erreur lors de la recherche de l'utilisateur:", error);
			throw new Error("Erreur lors de la recherche de l'utilisateur.");
		}
	}
	// Ajout d'un utilisateur
	async create(Credentia: thingsUsers): Promise<number> {
		try {
			// Validation des entrées
			if (
				!Credentia.firstname ||
				!Credentia.lastname ||
				!Credentia.email ||
				!Credentia.password ||
				!Credentia.birth_day
			) {
				throw new Error("Tous les champs obligatoires doivent être remplis.");
			}

			// La requête retourne un tableau avec deux éléments : les résultats et les en-têtes
			const [rows] = await pool
				.promise()
				.query<ResultSetHeader>(
					"INSERT INTO `user` (firstname, lastname, email, password, birth_day) VALUES (?, ?, ?, ?, ?)",
					[
						Credentia.firstname,
						Credentia.lastname,
						Credentia.email,
						Credentia.password,
						Credentia.birth_day,
					],
				);

			// Vérification si l'insertion a réussi
			if (rows.affectedRows === 0) {
				throw new Error("Aucune ligne affectée lors de l'insertion.");
			}

			// Retourner l'ID de l'utilisateur inséré
			return rows.insertId;
		} catch (error) {
			console.error("Erreur lors de l'ajout d'un utilisateur :", error);
			throw error; // Relancer l'erreur pour la gestion en amont
		}
	}

	async read(id: string) {
    try {
      const [rows] = await pool
				.promise()
				.query<RowDataPacket[]>(
          "SELECT firstname, lastname, email, birth_day FROM `user` WHERE id = ?",[id]
        );
        console.log("Résultat :", rows);
        if (rows.length > 0) {
          return rows[0] as unknown as string;
        }
        return null;
    } catch (error) {
      
    }
  }

	async readAll() {}

	async update(user_id: string, user: Partial<thingsUsers>): Promise<number> {
		try {
			console.log(
				"🔍 Début de la mise à jour SQL pour l'utilisateur :",
				user_id,
			);
			const [rows] = await pool
				.promise()
				.query<ResultSetHeader>(
					"UPDATE `user` SET firstname = ?, lastname = ?, email = ?, password = ?, birth_day = ? WHERE id = ?",
					[
						user.firstname,
						user.lastname,
						user.email,
						user.password,
						user.birth_day,
						user_id, // Assurez-vous de passer l'id pour identifier quel utilisateur mettre à jour
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
			console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
			throw error;
		}
	}

	async delete(user_id: string): Promise<number> {
		try {
			const [rows] = await pool
				.promise()
				.query<ResultSetHeader>("DELETE from `user` WHERE id = ?", [user_id]);
			return rows.affectedRows;
		} catch (error) {
			console.error("Erreur lors de la suppression de l'utilisateur :", error);
			throw error;
		}
	}
}

export default new usersRepositorie();
// function connectDB() {
// 	throw new Error("Function not implemented.");
// }
