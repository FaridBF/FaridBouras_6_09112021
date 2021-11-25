const Sauces = require("../models/Sauces"); // require permet d'importer un modèle lorsqu'il s'agit d'un chemin local
// remplacement de app par router car enregistrement de toutes ces routes sur le router

const fs = require("fs"); // import du package de node js filesystem (accès aux # opérations liés au système de fichiers)

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

// Pour modifier une sauce//
exports.modifySauce = (req, res, next) => {
  const saucesObject = req.file // opréateur permettant de demander si req.file existe
    ? {
        // si on trouve un fichier
        ...JSON.parse(req.body.sauce), // on récupère la chaîne de caractère puis on la parse en objet
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          //puis en modifie l'image URL
          req.file.filename
        }`,
      }
    : { ...req.body }; // et Sinon on prends le corps de la reqûete
  Sauces.updateOne(
    { _id: req.params.id },
    { ...saucesObject, _id: req.params.id } // on prends cet objet que nous avons créé peu importe son format, de là on modifie son identifiant afin que cela corresponde au paramètre de requête
  ) // méthode update one permet de modifier l'objet en question
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer une sauce//
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id }) // trouver le produit en question via findOne
    .then((sauces) => {
      // dans le callback on récupère un thing
      const filename = sauces.imageUrl.split("/images/")[1]; // récupération de l'imageURL du thing récupérer par la base (on spilt le tableau des 2 éléments)
      fs.unlink(`images/${filename}`, () => {
        // fonction unlink de fs pour supprimer un fichier en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
        Sauces.deleteOne({ _id: req.params.id }) //méthode delete one permet de supprimer l'objet en question (avec objet de comparaison en argument comme pour find one et update one)
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error })); // erreur serveur si produit non trouvé
};
