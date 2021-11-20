const http = require("http");
const app = require("./app");

app.set("port", process.env.PORT || 3000);

const server = http.createServer((req, res) => {
  res.end("Voila la réponse du serveur");
});

// chargement des variables d'environnement du fichier .env dans process.env
const dotenv = require("dotenv");
dotenv.config();

// écouter le serveur sur le port choisi ou  port 3000 par defaut
server.listen(process.env.PORT || 3000);
