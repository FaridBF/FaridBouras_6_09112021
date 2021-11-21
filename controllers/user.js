//package de cryptage pour les mot de passe  npm install -- save bcrypt
// suite à l'installation on importe
const bcrypt = require("bcrypt");

// package token à installer (permet d'encoder un token afin de vérifier si l'utilisateur s'est bien authentifier) - npm install --save jsonwebtoken
// suite à l'installation on importe comme ceci:
const jwt = require("jsonwebtoken");

const User = require("../models/User"); // on a besoin de notre model user car on enregistrer et lire des users dans ce middleware

// infrastructure controller pour le user
// 2 fonction => 2 middleware
// pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // hash permet de crypter le mdp (fonction asynchonne)
    //puis on lui passe le mdp du corps de la reqûete qui sera passé par le frontend
    // le solde 10 c'est le nombre de fois ou on éxécute l'algorithme de hashage (plus le nombre est élévé plus l'éxécution mettra de temps)
    .then((hash) => {
      // on récupère le hash de mot de passe
      const user = new User({
        // création d'un nouvel utilisateur avec notre model mongoose
        email: req.body.email, // on passe en adresse mail ce qui est fournit dans le corps de la requête
        password: hash, // on enregistre le mdp crypté afin de ne pas stocker le mdp
      });
      user
        .save() // méthode save afin de l'enregistrer dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // on va renvoyer un 201 pour une création de ressource plus le message : utilisteur créé
        .catch((error) => res.status(400).json({ error })); // erreur 400 pour différencier de l'erreur 500 déja utilisé
      return;
    })
    .catch((error) => res.status(500).json({ error })); // erreur serveur envoyé dans un objet
  // next();
};

// pour connecter les utilisateurs existants à l'application
exports.login = (req, res, next) => {
  //récupération de l'utilisateur de la base qui correspond à l'adresse mail entrée
  User.findOne({ email: req.body.email }) // méthode find one pour trouver un utilisateur dans la base de données (objet filtre de comparaison : adresse mail)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "Utilisateur non trouvé !" }); // erreur indiquant que l'utilisateur est non trouvé donc non autorisé
      }
      bcrypt
        .compare(req.body.password, user.password) // fonction compare avec le package bcrypt le mdp envoyé avec la reqûete et le hash enregistré dans notre document user
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" }); // erreur serveur également
          }
          // console.log("ok")
          res.status(200).json({
            // renvoyer un statut connexion pour confirmation la bonne réalisation de la reqûete
            userId: user._id, // identifiant de l'utilisateur
            token: jwt.sign(
              // génération d'un token crypté par la suite pour l'instant on envoie juste un token comme celui-ci (simplement une chaîne de caractère)
              // fonction sign prends plusieurs arguments
              { userId: user._id }, //le premier aurgument est user id: identifiant utilisateur
              "RANDOM_TOKEN_SECRET", // le deuxième argument : clé secrète pr l'encodage normalement une châine de caractère plus longue et aléatoire
              { expiresIn: "24h" } // le troisième argument est  une argument de configuration , en l'occurence ici c'est la durée de validité du token
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
      // problème de connexion liée à mongo DB - erreur 500 : serveur
      // console.log("ko")
      // return;
    })
    .catch((error) => res.status(500).json({ error }));
};
