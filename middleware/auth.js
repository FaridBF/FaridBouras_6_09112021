// middleware d'auth pour vérifier le token envoyé par l'applicat° frontend
// pour chaque reqûete protéger on va passer par ce middleware

const jwt = require("jsonwebtoken"); // pour vérifier les tokens

// chgt des variables d'env° du fichier .env dans process.env
const dotenv = require("dotenv");
dotenv.config();

module.exports = (req, res, next) => {
  // exportation du middleware
  try {
    // récupération du deuxième élément de ce tableau  via split
    const token = req.headers.authorization.split(" ")[1];
    // constante pour decoder le token
    // (clé secrète en argument identique à la fonction login)
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);
    // récupération du user ID encoder dans l'objet JS
    const userId = decodedToken.userId;
    // vérif du userID dans le corps de la requête différent du userID du token
    if (req.body.userId && req.body.userId !== userId) {
      // on ne souhaite pas authentifier la requête
      throw "Invalid user ID";
    } else {
      // si tout va bien on va simplement appeler next
      next(); // appliquer avant les controllers de nos routes
      // (si on arrive à else, on passe au prochain middleware)
    }
  } catch {
    res.status(401).json({
      // problème d'authentification
      error: new Error("Invalid request!")
    });
  }
};
