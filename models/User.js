const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema({
  // méthode schema de mongoose
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true } // le hash sera de type string
});

// ce validator, on l'applique au schéma avant d'en faire un modèle
// on ne pourra pas avoir plusieurs utilisateurs avec la même adresse mail
userSchema.plugin(uniqueValidator);

// exporter le schema sous forme de modèle
module.exports = mongoose.model("User", userSchema);
// le modèle va se nommer User et on lui passe userSchema
