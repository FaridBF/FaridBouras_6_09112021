const multer = require("multer");

const MIME_TYPES = {
  // dictionnnaire de mime_types indiquant donc les traductions(objet)
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
};

// f° afin d'indiquer que l'enrgt se fera sur le disque
const storage = multer.diskStorage({
  // f° destination (3 arguments: la requête, le fichier et un callback)
  destination: (req, file, callback) => {
    // cela explique à multer où enregistrer le fichier
    callback(null, "images");
    // 1er en null afin d'indiquer qu'il n'y a pas eu d'erreurs
    // 2ème arguments:le dossier images
  },
  // f° permettant d'expliquer le nom du fichier à utiliser
  filename: (req, file, callback) => {
    // on génère le nouveau nom pour le fichier via originalname
    // remplace les espaces par des underscore et supprime l'extension d'origine
    const name = file.originalname.split(" ").join("_").split(".", 1);
    // création de l'extension du fichier:
    // l'élément de notre dict° correspondant au mimetype envoyé par le frontend
    const extension = MIME_TYPES[file.mimetype];
    // Date.now:c'est un timestamp afin de le rendre le plus unique possible
    callback(null, name + Date.now() + "." + extension);
  },
});

// exporter le middleware configuré
module.exports = multer({ storage: storage }).single("image");
// méthode single pour dire que c'et un fichier unique
//  on passe notre objet storage à notre méthode multer
// on indique image à single car il s'agit uniquement d'image
