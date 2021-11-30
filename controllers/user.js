const bcrypt = require("bcrypt"); // Le package bcrpyt permet un cryptage sécurisé avec un algorithme unidirectionnel.
const jwt = require("jsonwebtoken");

// chargement des variables d'environnement du fichier .env dans process.env
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User");

// infrastructure controller pour le user concernant l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10) // hash permet de crypter le mdp (fonction asynchonne) puis on lui passe le mdp du corps de la reqûete qui sera passé par le frontend
    // le solde 10 c'est le nombre de fois ou on éxécute l'algorithme de hashage (plus le nombre est élévé plus l'éxécution mettra de temps)
    .then((hash) => {
      // on récupère le hash de mdp
      const user = new User({
        // création d'un nouvel utilisateur avec notre model mongoose
        email: req.body.email, // on passe en adresse mail ce qui est fournit dans le corps de la requête
        password: hash, // on enregistre le mdp crypté afin de ne pas stocker le mdp
      });
      user
        .save() // méthode save afin de l'enregistrer dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" })) // on va renvoyer un 201 pour une création de ressource plus le message : utilisteur créé
        .catch((error) => res.status(400).json({ error })); // erreur 400 pour différencier de l'erreur 500 déja utilisé
    })
    .catch((error) => res.status(500).json({ error })); // erreur serveur envoyé dans un objet
};

// pour connecter les utilisateurs existants à l'application
exports.login = (req, res) => {
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
          res.status(200).json({
            // renvoyer un statut connexion pour confirmation la bonne réalisation de la reqûete
            userId: user._id, // identifiant de l'utilisateur
            token: jwt.sign(
              // génération d'un token crypté par la suite pour l'instant on envoie juste un token comme celui-ci (une chaîne de caractère)
              { userId: user._id }, //le premier argument est user id: identifiant utilisateur
              process.env.SECRET_TOKEN, // le deuxième argument : clé secrète pr l'encodage
              { expiresIn: "24h" } // le troisième argument concerne la configuration, en l'occurence ici c'est la durée de validité du token
            ),
          });
        })
        .catch((error) => res.status(500).json({ error })); // problème de connexion liée à mongo DB - erreur 500 : serveur
    })
    .catch((error) => res.status(500).json({ error }));
};
