import express from "express";

const router = express.Router();

//importation pour les routes
import usersAction from './modules/users/usersAction';

//creation d'un user
router.post("/api/user", usersAction.add);
//modifier les données de l'user
router.put("/api/user/update/:id", usersAction.modif);
//suppression d'un utilisateur
router.delete("/api/user/delete/:id" , usersAction.Destroy)

// Définir des routes

export default router;
