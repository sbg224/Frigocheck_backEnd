import type { RequestHandler } from "express";
import { scrapePromotionsCarrefour } from "../scraoing/scrapCarrefour";
import scrapCarrefourRepository from "./scrapCarrefourRepository";

// Handler pour scrapper et sauvegarder les promotions Carrefour
const scrapAndSaveCarrefour: RequestHandler = async (req, res) => {
  try {
    // 1. Scrapping des promotions
    const promotions = await scrapePromotionsCarrefour();
    console.log("🔍 Promotions récupérées :", promotions);

    // 2. Sauvegarde des promotions en BDD
    await scrapCarrefourRepository.saveScrap(promotions, "carrefour");

    // Retour d'une réponse succès avec un message informatif
    res.status(200).json({ message: "✅ Promotions Carrefour sauvegardées !" });
  } catch (err) {
    // Vérification du type d'erreur
    if (err instanceof Error) {
      // Log de l'erreur et renvoi d'une réponse d'erreur avec un message détaillé
      console.error("❌ Erreur scrapping Carrefour :", err.message);
      res.status(500).json({ message: "❌ Erreur lors du scrapping des promotions Carrefour.", error: err.message });
    } else {
      // Dans le cas où l'erreur n'est pas une instance d'Error
      console.error("❌ Erreur inconnue :", err);
      res.status(500).json({ message: "❌ Erreur inconnue." });
    }
  }
};

const brows: RequestHandler = async (req, res, next) => {
  try {
    const getAll = await scrapCarrefourRepository.getScrap();
    if (!getAll) {
			res.status(404).json({ message: "utilisateur non trouvé" });
			return;
		}

		res.status(200).json({ data: getAll });
	} catch (error) {
		next(error);
	}
}

export default { scrapAndSaveCarrefour, brows };