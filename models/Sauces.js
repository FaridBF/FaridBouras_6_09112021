// création d'un schéma ( modèle de données), afin de connaître les sauces qui sont dans notre base de données.
const mongoose = require("mongoose");

// fonction schema de mongoose
const saucesSchema = mongoose.Schema({
  //inutile de mettre l'ID car généré automatiquement par la base mongodb
  userId: { type: String, required: true }, // la clé c'est le nom du champs
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: Array, required: true },
  usersDisliked: { type: Array, required: true },
});

// exportation du modèle terminé
module.exports = mongoose.model("Sauces", saucesSchema); // 2 arguments au modèle utilisé nom du modèle(Sauces.js) et le nom du schéma de données (saucesSchema))
