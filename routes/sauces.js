// Création d'un routeur que l'on va importer dans l'application
const express = require("express");
const router = express.Router(); // création d'un routeur avec la méthode d'express

// const saucesCtrl = require("../controllers/sauces");

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

module.exports = router; // réexport sur router de ce fichier là
