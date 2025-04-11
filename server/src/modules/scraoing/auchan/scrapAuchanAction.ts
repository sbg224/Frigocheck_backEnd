import type { RequestHandler } from "express";
import {scrapePromotionsAuchan } from "../scrapCarrefour";
import scrapAuchanRepository from "./scrapAuchanRepository";

// Handler pour scrapper et sauvegarder les promotions Carrefour
const scrapAndSaveAuchan: RequestHandler = async (req, res) => {
  try {
    // 1. Scrapping des promotions
    const promotions = await scrapePromotionsAuchan();
    console.log("🔍 Promotions récupérées :", promotions);
    if (promotions.length === 0) {
      console.warn("Aucune promotion récupérée");
    }

    // 2. Sauvegarde des promotions en BDD
    await scrapAuchanRepository.saveScrap(promotions, "Auchan");

    // Retour d'une réponse succès avec un message informatif
    res.status(200).json({ message: "✅ Promotions Auchan sauvegardées !" });
  } catch (err) {
    // Vérification du type d'erreur
    if (err instanceof Error) {
      // Log de l'erreur et renvoi d'une réponse d'erreur avec un message détaillé
      console.error("❌ Erreur scrapping Auchan :", err.message);
      res.status(500).json({
        message: "❌ Erreur lors du scrapping des promotions Auchan.",
        error: err.message,
      });
    } else {
      // Dans le cas où l'erreur n'est pas une instance d'Error
      console.error("❌ Erreur inconnue :", err);
      res.status(500).json({ message: "❌ Erreur inconnue." });
    }
  }
};

const brows: RequestHandler = async (req, res, next) => {
  try {
    const getAll = await scrapAuchanRepository.getScrap();
    if (!getAll) {
      res.status(404).json({ message: "utilisateur non trouvé" });
      return;
    }

    res.status(200).json({ data: getAll });
  } catch (error) {
    next(error);
  }
};

export default { scrapAndSaveAuchan, brows };
