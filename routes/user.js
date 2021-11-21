//le routeur qui a besoin de la fonction express (express sert à créer un routeur)
const express = require("express");
const router = express.Router(); // création du routeur avec la fonction express
const userCtrl = require("../controllers/user"); //configuration du routeur car il faut le controller
// puiqu'il permet d'assurer les différentes fonctions aux différentes routes

//Création de deux routes post
router.post("/signup", userCtrl.signup); // méthode signup
router.post("/login", userCtrl.login); // méthode login
//il s'agit de routes post parce que le front end va envoyer des informations (adresse mail et le mot de passe)

module.exports = router; // exportation de ce routeur afin qu'il puisse être importer dans app.js sous la forme const userRoutes = require('./routes/user');
