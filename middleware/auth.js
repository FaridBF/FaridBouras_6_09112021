// Création d'un middleware d'authentification pour vérifier le token envoyé par l'application frontend avec sa reqûete
// s'il s'agit d'un token valable et que le UserID qui est envoyé avec la requête, qu'il corresponde bien avec celui qui est encoder dans le token (pour chaque reqûete protéger on va passer par ce middleware)

const jwt = require("jsonwebtoken"); // le package jsonwebtoken afin de vérifier les tokens

// chargement des variables d'environnement du fichier .env dans process.env
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  // exportation du middleware
  try {
    const token = req.headers.authorization.split(" ")[1]; // récupération du deuxième élément de ce tableau  via split
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); // constante pour decoder le token ( clé secrète en argument identique à la fonction login)
    const userId = decodedToken.userId; // récupération de l'objet JS - récupération du user ID encoder dedans
    if (req.body.userId && req.body.userId !== userId) {
      // vérification du userID dans le corps de la requête différent du userID du token alors erreur
      throw "Invalid user ID"; // affichage du message d'erreur USER ID NON VALABLE // on ne souhaite pas authentifier la requête
    } else {
      // si tout va bien on va simplement appeler next
      next(); // appliquer avant les controllers de nos routes (si on arrive à else c'est que tout va bien donc on peux passer au prochain middleware)
    }
  } catch {
    res.status(401).json({
      // problème d'authentification
      error: new Error("Invalid request!"),
    });
  }
};
