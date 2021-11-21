const http = require("http");
const app = require("./app");

// chargement des variables d'environnement du fichier .env dans process.env
const dotenv = require("dotenv");
dotenv.config();

// fonction qui renvoie un port valide (fourni sous forme de int ou string)
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// écouter le serveur sur le port choisi ou  port 3000 par defaut
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

//fonction de gestion des erreurs
const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

//écoute les évènements lorsque le serveur est ON
server.on("error", errorHandler);
//premier paramètre: évènement / deuxième paramètre: fonction callback
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
