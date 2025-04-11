import puppeteer from "puppeteer";

export interface Promotion {
	nom: string;
	prix: string;
	anciennePromo?: string | null;
	promoInfo?: string | null;
}

export async function scrapePromotionsCarrefour(): Promise<Promotion[]> {
	const browser = await puppeteer.launch({
		headless: false, // si tu veux voir le navigateur, mets false
		defaultViewport: null,
		args: ["--no-sandbox", "--disable-setuid-sandbox"],
	});

	const page = await browser.newPage();

	// 🌐 Page des promotions Carrefour
	await page.goto("https://www.carrefour.fr/promotions", {
		waitUntil: "networkidle2",
	});
	// ⏳ Attendre que les promotions soient présentes dans le DOM
	await page.waitForSelector(
		".ds-product-card__promotion.main-layout__promotion",
		{ timeout: 10000 },
	);
	// 3. (Optionnel) Faire un screenshot pour debug
	await page.screenshot({ path: "carrefour-promos.png", fullPage: true });

	// 🔍 Extraction des promos
	const promotions: Promotion[] = await page.evaluate(() => {
		const promos: {
			nom: string;
			prix: string;
			anciennePromo?: string | null;
			promoInfo?: string | null;
		}[] = [];

		const articles = document.querySelectorAll(
			"article.main-layout.ds-product-card",
		); // à adapter si différent

		for (const article of articles) {
			const nom = article
				.querySelector(".main-layout__infos-product")
				?.textContent?.trim();
			const prix = article
				.querySelector(".product-price__amount--main")
				?.textContent?.trim();
			const anciennePromo =
				article
					.querySelector(".product-price__amount--old")
					?.textContent?.trim() || null;
			const promoInfo =
				article
					.querySelector(".promotion-label-refonte__promo")
					?.textContent?.trim() || null;
			// promotion-label-refonte

			if (nom && prix) {
				promos.push({ nom, prix, anciennePromo, promoInfo });
			}
		}

		return promos;
	});

	await browser.close();
	return promotions;
}

// Nouvelle fonction pour Auchan
export async function scrapePromotionsAuchan(): Promise<Promotion[]> {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  // 🌐 Page des promotions Auchan
  await page.goto("https://www.auchan.fr/boutique/promos", {
    waitUntil: "networkidle2",
  });
  // ⏳ Attendre que les promotions soient présentes dans le DOM
  await page.waitForSelector(
    ".product-thumbnail__content-wrapper", // Cette classe semble correcte pour s'assurer que les produits sont chargés
    { timeout: 10000 },
  );

  // 3. (Optionnel) Faire un screenshot pour debug
  await page.screenshot({ path: "auchan-promos.png", fullPage: true });
  console.log("Screenshot pris pour vérifier le contenu de la page");

  // 🔍 Extraction des promos
  const promotions: Promotion[] = await page.evaluate(() => {
    const promos: {
      nom: string;
      prix: string;
      anciennePromo?: string | null;
      promoInfo?: string | null;
    }[] = [];

    const articles = document.querySelectorAll(
      "article.product-thumbnail.list__item.shadow--light.product-thumbnail--column",
    );

    for (const article of articles) {
      const nomElement = article.querySelector(
        ".product-thumbnail__details .product-description",
      );
      const nom = nomElement?.textContent?.trim() || null;

      const prixElement = article.querySelector(".product-price.bolder.text-dark-color");
      const prix = prixElement?.textContent?.trim() || null;

      const anciennePromoElement = article.querySelector(".product-price--small.product-price--old.text-dark-color.normal.bold");
      const anciennePromo = anciennePromoElement?.textContent?.trim() || null;

      const promoInfoElement = article.querySelector(".product-thumbnail__commercials .product-discount-label");
      const promoInfo = promoInfoElement?.textContent?.trim() || null;

      if (nom && prix) {
        promos.push({ nom, prix, anciennePromo, promoInfo });
      }
    }

    return promos;
  });

  await browser.close();
  console.log(`Nombre total de promotions récupérées : ${promotions.length}`);
  console.log("🔍 Promotions récupérées :", promotions); // Ajout pour le débogage
  return promotions;
}