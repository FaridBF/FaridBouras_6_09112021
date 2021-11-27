const multer = require("multer"); // importer multer

const MIME_TYPES = {
  // dictionnnaire de mime_types indiquant donc les traductions (objet)
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  // fonction de multer qui est diskStorage afin d'indiquer que l'enregistrement se fera sur le disque
  destination: (req, file, callback) => {
    //fonction destination (3 arguments: la requête, le fichier et un callback) - cela explique à multer où enregistrer le fichier
    callback(null, "images"); // 1er argument null afin d'indiquer qu'il n'y a pas eu d'erreurs à ce niveau là / 2 ème arguments : le dossier images
  },
  filename: (req, file, callback) => {
    // fonction permettant d'expliquer le nom du fichier à utiliser
    // on génère le nouveau nom pour le fichier en utilisant le nom d'origine du fichier via la propriété originalname
    const name = file.originalname.split(" ").join("_").split(".", 1); // on remplace les espaces par des underscore et supprime l'extension d'origine
    const extension = MIME_TYPES[file.mimetype]; // création de l'extension du fichier: ça sera l'élément de notre dict° correspondant au mimetype du fichier envoyé par le frontend
    callback(null, name + Date.now() + "." + extension); // Date.now: c'est un timestamp afin de le rendre le plus unique possible
  },
});

module.exports = multer({ storage: storage }).single("image"); // exporter le middleware complétement configuré (méthode single afin d'inidquer qu'il s'agit d'un fichier unique)
// on passe notre objet storage à notre méthore multer / on indique image à single car il s'agit uniquement d'image
