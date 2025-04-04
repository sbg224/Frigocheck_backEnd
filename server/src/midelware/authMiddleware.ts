import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Définir une interface pour req.user
interface AuthRequest extends Request {
  user?: { id: number };
}

export const authenticateUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Vérifier si le token est présent dans les cookies
    const token = req.cookies.authToken;
    if (!token) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    // Vérifier si JWT_SECRET est défini
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET n'est pas défini dans .env !");
      res.status(500).json({ message: "Erreur serveur, JWT_SECRET manquant" });
      return;
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, secret) as { id: number };

    // Ajouter l'utilisateur à l'objet request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    res.status(401).json({ message: "Token invalide ou expiré" });
    return;
  }
};