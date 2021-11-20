const http = require('http');
const server = http.createServer((req, res) => {
    res.end('Voila la réponse du serveur') 
});

// écouter le serveur sur le port choisi ou  port 3000 par defaut
server.listen(process.env.PORT || 3000);