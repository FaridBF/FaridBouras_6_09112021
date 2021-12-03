const Sauces = require("../models/Sauces");

const fs = require("fs"); // accès aux # opérations liés au système de fichiers

// afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauces.find() // retourne Promise
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

// afficher uniquement 1 sauce
exports.getOneSauce = (req, res, next) => {
  // le :id permet de dire que ce paramètre de route est dynamique
  Sauces.findOne({ _id: req.params.id })
    // modèle puis méthode find one afin de trouver uniquement 1 objet
    // puis objet de comparaison req.params.id
    .then((sauce) => res.status(200).json(sauce))
    // réponse de 200 s'il en trouve
    .catch((error) => res.status(404).json({ error }));
  // renvoie de l'erreur 404 objet non trouvé
};

// pour créer une sauce
exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  // extraire l'objet json en objet JS
  // on va supprimer le champs avant de copier l'objet
  delete saucesObject._id;
  const sauce = new Sauces({
    ...saucesObject,
    // modifications de l'URL de l'image
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    dislikes: 0,
    likes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  // la méthode save enregistre l'objet dans la base
  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: "Votre sauce est enregistrée !" })
    )
    .catch((error) => res.status(400).json({ error }));
};

// pour modifier une sauce (front vérifie déjà que tout est rempli)
exports.modifySauce = (req, res, next) => {
  // vérifier si req.file existe (dc si image est modifiée) via un ternaire
  const saucesObject = req.file
    ? {
        // si on trouve un fichier
        ...JSON.parse(req.body.sauce),
        // on récupère la chaîne de caractère puis on la parse en objet JS
        // puis on modifie l'image URL
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  // et Sinon on prend le corps de la reqûete
  Sauces.updateOne(
    { _id: req.params.id },
    { ...saucesObject, _id: req.params.id }
    // on prend l'objet que nous avons créé.
    // on modifie son id afin que cela corresponde au paramètre de req°
  )
    .then(() => res.status(200).json({ message: "Votre sauce est modifiée !" }))
    .catch((error) => res.status(400).json({ error }));
};

// supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => {
      // dans le callback on récupère les sauces ( déclarer dans le then)
      const filename = sauce.imageUrl.split("/images/")[1];
      // récupération de l'imageURL afin de récupérer par la base
      // puis on split le tableau des 2 éléments
      fs.unlink(`images/${filename}`, () => {
        // fonction unlink de fs pour supprimer un fichier
        Sauces.deleteOne({ _id: req.params.id })
          // permet de supprimer l'objet en question
          .then(() =>
            res.status(200).json({ message: "Votre sauce est supprimée !" })
          )
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
  // erreur serveur si produit non trouvé
};

// pour aimer ou ne pas aimer une sauce
exports.likeOrDislike = (req, res, next) => {
  // console.log(req);
  // console.log("params: ", req.params);
  // console.log("body: ", req.body);
  if (req.body.like === 1) {
    Sauces.updateOne(
      // met à jour le 1 doc d'une collect° qui correspond à une condit°
      { _id: req.params.id },
      {
        // permet d'utiliser la notat° par points.
        $inc: { likes: 1 }, //  incrémente un champ d'une valeur spécifiée
        $push: { usersLiked: req.body.userId },
        // $push est utilisé pour ajouter une valeur spécifiée à un tableau
      }
    )
      .then(() =>
        res
          .status(200)
          .json({ message: "Votre like a été ajouté pour cette sauce !" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauces.updateOne(
      { _id: req.params.id },
      // req.params est pour les paramètres de l'itinéraire
      // dans cet itinéraire c'est _id:
      {
        $inc: { dislikes: 1 },
        // accepte les valeurs positives et négatives comme montant incrémentiel
        $push: { usersDisliked: req.body.userId },
        // inclut la valeur mentionnée comme élément
      }
    )
      .then(() =>
        res
          .status(200)
          .json({ message: "Votre dislike a été ajouté pour cette sauce !" })
      )
      .catch((error) => res.status(400).json({ error }));
  } else {
    // si like === 0
    Sauces.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
            // $pull supprime le user id du tableau et fait -1 sur likes
          )
            .then(() => {
              res.status(200).json({
                message: "Votre like a été retiré pour cette sauce !",
              });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauces.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then(() => {
              res.status(200).json({
                message: "Votre dislike a été retiré pour cette sauce !",
              });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
