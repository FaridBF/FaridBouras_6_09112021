// Création d'un routeur que l'on va importer dans l'application
const express = require("express");
const router = express.Router(); // création d'un routeur avec la méthode d'express

const auth = require("../middleware/auth"); // importation de notre middleware dans le but de protéger nos routes

const multer = require("../middleware/multer-config"); // importation de notre middleware

const saucesCtrl = require("../controllers/sauces"); // importation de notre controllers sauces

//La logique métier des routes//

// route permettant de trouver 1 seul objet via son identifiant (le but étant d'intérargir avec notre base de données)
router.get("/:id", auth, saucesCtrl.getOneSauce);

// url visé par l'application frontend
router.get("/", auth, saucesCtrl.getAllSauces);

// traitement des requêtes post
router.post("/", auth, multer, saucesCtrl.createSauce); // auth - on ajoute le middleware à la route que l'on souhaite protéger (multer après auth car vérif avant traitement de l'image)

// route put pour la modification d'un objet existant qui sera envoyé au moment ou l'utilisateur procédera à la modification de cet objet via le bouton modifier
router.put("/:id", auth, multer, saucesCtrl.modifySauce);

// route delete pour la suppresion d'un objet
router.delete("/:id", auth, saucesCtrl.deleteSauce);

// route liker ou disliker les sauces
router.post("/:id/like", auth, saucesCtrl.likeOrDislike);

module.exports = router; // réexport sur router de ce fichier là
