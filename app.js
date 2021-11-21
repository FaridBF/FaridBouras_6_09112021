const express = require("express");

const mongoose = require("mongoose");

// chargement des variables d'environnement du fichier .env dans process.env
const dotenv = require("dotenv");
dotenv.config();

// Connexion à la base de données
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}@piiquantedb.q8myq.mongodb.net/${process.env.NAME_DATABASE}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();
// permet de pallier à l'erreur CORS afin de donner l'accès aux requêtes envoyés à nos serveurs
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // * accès à tout le monde
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // les headers autorisés (en têtes)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // les méthodes autorisées (verbes de requêtes)
  next();
});

// transformation du corps de la requête en objet JS utilisable (remplace body parser)
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

module.exports = app;
