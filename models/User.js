// comme pour les things on va importer mongoose afin de créer un schéma
const mongoose = require("mongoose");
// à la suite de l'installation du packgage on va ajouter ce validator comme plugin à notre schéma
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = mongoose.Schema({
  // fonction schema de mongoose //
  email: { type: String, required: true, unique: true }, // les infos que l'on va stocker
  // unique permet d'éviter que plusieurs User s'enregistre avec la meme adresse mail // installer en parallèle npm install --save mongoose-unique-validator
  //cette technique unique:true  fonctionne mais ne suffit pas d'ou la nécessité du packagage pour éviter certaines erreurs illisibles
  password: { type: String, required: true }, // le hash sera de type string également
});

// ce validator, on l'applique au schéma avant d'en faire un modèle (on ne pourra pas avoir plusieurs utilisateur avec la même addresse mail)
userSchema.plugin(uniqueValidator); // méthode plugin avec comme argument à appliquer à cette méthode uniqueValidator

// on va exporter ce schema sous forme de modèle
module.exports = mongoose.model("User", userSchema); // fonction model de mongoose / le modèle va se nommer User et on lui passe userSchema comme schéma de données
