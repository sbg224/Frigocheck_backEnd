import { pool } from "../../../../database/bdd";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

interface Promotion {
	nom: string;
	prix: string;
	anciennePromo?: string | null;
	promoInfo?: string | null; // Ajout de promoInfo dans l'interface
}

class ScrapCarrefourRepository {
	async getScrap(): Promise<Promotion[]> {
		try {
			const [rows] = await pool.promise().query<RowDataPacket[]>(`
        SELECT nom, prix, anciennePromo, promoInfo 
        FROM promotions 
        WHERE source = 'carrefour'
      `);
			return rows as Promotion[];
		} catch (error) {
			console.error("Erreur lors de la récupération des promotions :", error);
			throw error; // On relance l'erreur pour pouvoir la gérer plus haut
		}
	}

	async saveScrap(promos: Promotion[], source: string): Promise<void> {
		const connection = await pool.promise().getConnection();
		try {
			await connection.beginTransaction();

			const insertPromises = promos.map((promo) => {
				console.log(`Insertion de la promotion: ${promo.nom}`); // Log de la promotion
				return connection.query<ResultSetHeader>(
					`INSERT INTO promotions (nom, prix, anciennePromo, promoInfo, source)
          VALUES (?, ?, ?, ?, ?)`,
					[promo.nom, promo.prix, promo.anciennePromo, promo.promoInfo, source],
				);
			});

			await Promise.all(insertPromises);

			await connection.commit();
			console.log("✅ Toutes les promotions ont été insérées");
		} catch (error) {
			console.error(
				"Erreur lors de l'insertion des promotions dans la base de données",
				error,
			);
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}
}

export default new ScrapCarrefourRepository();
