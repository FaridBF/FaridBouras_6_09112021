const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const helmet = require("helmet");
const session = require("cookie-session");
const nocache = require("nocache");
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");

// Connexion à la base de données MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.USER_DB}:${process.env.PASSWORD_DB}`
    +`@piiquantedb.q8myq.mongodb.net/${process.env.NAME_DATABASE}`
    +`?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Lancement du framework Express
const app = express();

// Permet de pallier à l'erreur CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Ajout de headers à l'objet "response"
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // les headers autorisés (en têtes)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// Transformation du corps de la requête en objet JSON utilisable
app.use(express.json()); // (remplace body parser)
app.use(
  express.urlencoded({
    extended: true
  })
);

// Sécuriser Express en définissant divers en-têtes HTTP
app.use(helmet());

// Sécurisation des cookies afin d'accroître la sécurité
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
app.use(
  session({
    cookie: {
      domain: `http://localhost:${process.env.port || "3000"}`,
      expires: expiryDate,
      httpOnly: true,
      path: "/",
      secure: true
    },
    name: process.env.SECRET_NAME,
    secret: process.env.SECRET_SESSION
  })
);

// Désinfecte les inputs contre l'injection de requêtes NoSQL
app.use(mongoSanitize());

// Pour désactiver la mise en cache du navigateur
app.use(nocache());

// Rendre le dossier  des "images" complémentement statique
app.use("/images", express.static(path.join(__dirname, "images")));

// Enregistrement des routes dans notre application
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

module.exports = app;
