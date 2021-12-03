// permet un cryptage sécurisé avec un algorithme unidirectionnel.
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Chrgt des variables d'env° du fichier .env dans process.env
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");

// Inscription
exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10) // hash permet de crypter le mdp
    // le solde 10 c'est le nombre de fois ou on éxécute l'algorithme de hashage
    .then((hash) => {
      // on récupère le hash de mdp
      const user = new User({
        // création d'un nouvel utilisateur
        email: req.body.email,
        // on passe en adresse mail le corps de la requête
        password: hash
        // on enregistre le mdp crypté afin de ne pas stocker le mdp
      });
      user
        .save() // enregistrer dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        // on va renvoyer un 201 pour une création de ressource plus le message
        .catch((error) => res.status(400).json({ error }));
      // erreur 400 pour différencier de l'erreur 500 déja utilisé
    })
    .catch((error) => res.status(500).json({ error }));
  // erreur serveur envoyé dans un objet
};

// pour connecter les utilisateurs existants à l'application
exports.login = (req, res) => {
  // récupération de l'adresse mail entrée
  User.findOne({ email: req.body.email }) // trouver un utilisateur dans BDD
    // objet filtre de comparaison : adresse mail
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
        // erreur indiquant que l'utilisateur n'est pas autorisé
      }
      bcrypt
        .compare(req.body.password, user.password)
        // compare le mdp envoyé et le hash enregistré dans notre document user
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
            // erreur serveur également
          }
          // confirmation de la reqûete
          res.status(200).json({
            // identifiant de l'utilisateur
            token: jwt.sign(
              // envoie d'un token en chaîne de caractère
              { userId: user._id }, // user id: identifiant utilisateur
              process.env.SECRET_TOKEN, // clé secrète pr l'encodage
              { expiresIn: "24h" } // durée de validité du token
            ),
            userId: user._id
          });
        })
        .catch((error) => res.status(500).json({ error }));
      // problème de connexion liée à mongo DB - erreur 500 : serveur
    })
    .catch((error) => res.status(500).json({ error }));
};
