const Sauces = require("../models/Sauces"); // require permet d'importer un modèle lorsqu'il s'agit d'un chemin local
// remplacement de app par router car enregistrement de toutes ces routes sur le router

//Afficher toutes les sauces//
exports.getAllSauces = (req, res, next) => {
  Sauces.find() // retourne Promise
    .then((sauces) => res.status(200).json(sauces)) // retourne tableau des sauces en base en tant que réponse (reçu depuis la base de données)
    .catch((error) => res.status(400).json({ error }));
};

// Afficher uniquement 1 sauce//
exports.getOneSauce = (req, res, next) => {
  // le :id permet de dire que ce paramètre de route est dynamique
  Sauces.findOne({ _id: req.params.id }) // Sauces modèle mongoose puis méthode find one afin de trouver uniquement 1 objet // puis objet de comparaison req.params.id
    .then((sauce) => res.status(200).json(sauce)) // réponse de 200 s'il en trouve
    .catch((error) => res.status(404).json({ error })); // renvoie de l'erreur 404 objet non trouvé
};

// Pour créer une sauce //
exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce); // Extraire l'objet json
  //on va supprimer le champs avant de copier l'objet
  delete saucesObject._id;
  const sauce = new Sauces({
    // création d'une nouvelle instance
    ...saucesObject, // raccourci js de title: req.body.title,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename // modifications de l'URL de l'image (récupération des segments nécessaires de là ou se trouve notre image)
    }`,
    dislikes: 0,
    likes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save() // la méthode save enregistre l'objet dans la base
    .then(() => res.status(201).json({ message: "Objet enregistré !" })) // réponse d'un code 201 pour bonne création de la ressource
    .catch((error) => res.status(400).json({ error }));
};
