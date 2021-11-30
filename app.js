const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // importation afin d'avoir le chemin de notre système de fichiers
const dotenv = require("dotenv"); // chargement des variables d'environnement du fichier .env dans process.env
dotenv.config();

const helmet = require("helmet"); // collection de neuf fonctions middleware concernant la protection des en-têtes
// const csp = require("helmet-csp"); // commenter volontairement (présentation uniquement à l'oral)

const session = require("cookie-session"); // évite le vol de session
const nocache = require("nocache");
const mongoSanitize = require("express-mongo-sanitize"); // examine le corps de la demande, va supprimer les signes et les points dollar ( $ ) ( . ) avant d'exécuter les requêtes

const userRoutes = require("./routes/user"); // importation du routeur
const saucesRoutes = require("./routes/sauces");

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

// Permet de pallier à l'erreur CORS afin de donner l'accès aux requêtes envoyés à nos serveurs / Middleware CORS - Ajout de headers à l'objet "response"
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
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

// Transformation du corps de la requête en objet JSON utilisable (remplace body parser)
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//Sécuriser Express en définissant divers en-têtes HTTP
app.use(helmet());

// //Middleware complémentaire pour gérer le CSP : helmet-csp
// app.use(
//   csp({
//     directives: {
//       defaultSrc: ["'self'"], // requête faite du site vers le site

//       scriptSrc: ["'self'"], // utilisation du script uniquement du site

//       imgSrc: ["'self'"], // pour gestion des images en interne

//       sandbox: ["allow-forms", "allow-scripts"], // autorisation des forms et scripts

//       reportUri: "/report-violation", // une redirection en cas de violation du site

//       upgradeInsecureRequests: true, // mettre mon serveur au courant
//     },
//   })
// );

//Options de sécurisation des cookies pour accroître la sécurité
const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 heure
app.use(
  session({
    name: process.env.SECRET_NAME,
    secret: process.env.SECRET_SESSION,
    cookie: {
      secure: true, // Garantit que le navigateur n’envoie le cookie que sur HTTPS
      httpOnly: true, //- Garantit que le cookie n’est envoyé que sur HTTP(S), pas au JavaScript du client, c'est contre les attaques de type cross-site scripting
      domain: `http://localhost:${process.env.port || "3000"}`, //indique quels hôtes peuvent recevoir le cookie
      expires: expiryDate, //définir la date d’expiration des cookies persistants
      path: "/", //définit les urls autorisées à recevoir le cookie
    },
  })
);

// Assainissement des données, désinfecte les inputs contre l'injection de requêtes NoSQL
app.use(mongoSanitize());

//Pour désactiver la mise en cache du navigateur, va donc ajouter no-cache en-têtes
app.use(nocache()); //les utilisateurs non connectés ne pourront pas ouvrir les anciennes pages mises en cache

//Rendre le dossier  des "images" complémentement statique
app.use("/images", express.static(path.join(__dirname, "images"))); // Cela indique à Express qu'il faut gérer la ressource images de manière statique

// Enregistrement des routes dans notre application
app.use("/api/auth", userRoutes); // enregistrement de la route ici // route attendu par le frontend '/api/auth'
app.use("/api/sauces", saucesRoutes); // on remet le début de la route en premier paramètre
// et ensuite on dit en second paramètre que pour cette route là on importe le routeur qui est exporter par sauces.js

module.exports = app;
