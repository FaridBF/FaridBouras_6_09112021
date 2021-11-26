const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // importation afin d'avoir le chemin de notre système de fichiers
const dotenv = require("dotenv"); // chargement des variables d'environnement du fichier .env dans process.env
dotenv.config();

const helmet = require("helmet");

const userRoutes = require("./routes/user"); // importation du routeur (dossier routes puis prendre fichier user.js)
const saucesRoutes = require("./routes/sauces"); // importation du routeur (dossier models puis prendre fichier saucesjs)

// Connexion à la base de données MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@piiquantedb.q8myq.mongodb.net/${process.env.NAME_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Lancement du framework Express //
const app = express();

// permet de pallier à l'erreur CORS afin de donner l'accès aux requêtes envoyés à nos serveurs
//Middleware CORS - Ajout de headers à l'objet "response"
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * accès à tout le monde
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // les headers autorisés (en têtes)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // les méthodes autorisées (verbes de requêtes)
  next();
});

// transformation du corps de la requête en objet JSON utilisable (remplace body parser)
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// // Sécuriser Express en définissant divers en-têtes HTTP ( collection de neuf fonctions middleware)
app.use(helmet());

//Rendre le dossier  des "images" complémentement statique
app.use("/images", express.static(path.join(__dirname, "images"))); // Cela indique à Express qu'il faut gérer la ressource images de manière statique
//(un sous-répertoire de notre répertoire de base, __dirname ) à chaque fois qu'elle reçoit une requête vers la route /images

// Enregistrement des routes dans notre application
app.use("/api/auth", userRoutes); // enregistrement de la route ici // route attendu par le frontend '/api/auth' - la racine de tout ce qui est lié à l'authentification
app.use("/api/sauces", saucesRoutes); // on remet le début de la route en premier paramètre
// et ensuite on dit en second paramètre que pour cette route là on importe le routeur qui est exporter par sauces.js

module.exports = app;

// const mongoSanitize = require('express-mongo-sanitize');
// const nocache = require('nocache');

// /* Désinfecte les inputs contre les injections */
// app.use(mongoSanitize());

// /* Désactive la mise en cache du navigateur */
// app.use(nocache());
