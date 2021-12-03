// Création d'un routeur que l'on va importer dans l'application
const express = require("express");
const router = express.Router();
// création d'un routeur avec la méthode d'express

const auth = require("../middleware/auth");
//middleware dans le but de protéger nos routes

const multer = require("../middleware/multer-config");

const saucesCtrl = require("../controllers/sauces");

//La logique métier des routes//

// route permettant de trouver 1 seul objet via son identifiant
router.get("/:id", auth, saucesCtrl.getOneSauce);

// url visé par l'application frontend
router.get("/", auth, saucesCtrl.getAllSauces);

// traitement des requêtes post
router.post("/", auth, multer, saucesCtrl.createSauce);
// protéger la route avec auth

// route put pour la modification d'un objet existant
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
//vérif avant traitement de l'image avec multer

// route delete pour la suppresion d'un objet
router.delete("/:id", auth, saucesCtrl.deleteSauce);

// route liker ou disliker les sauces
router.post("/:id/like", auth, saucesCtrl.likeOrDislike);

module.exports = router; // réexport sur le routeur de ce fichier là
