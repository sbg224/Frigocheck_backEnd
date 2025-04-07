import puppeteer from "puppeteer";

export interface Promotion {
	nom: string;
	prix: string;
	anciennePromo?: string | null;
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
		}[] = [];

    const articles = document.querySelectorAll("article.main-layout.ds-product-card");// à adapter si différent

		for (const article of articles) {
      const nom = article.querySelector(".main-layout__infos-product")?.textContent?.trim();
      const prix = article.querySelector(".main-layout__infos-price")?.textContent?.trim();
      const anciennePromo =
        article.querySelector(".product-price--old")?.textContent?.trim() || null;


			if (nom && prix) {
				promos.push({ nom, prix, anciennePromo });
			}
		}

		return promos;
	});

	await browser.close();
	return promotions;
}
