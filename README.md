# FaridBouras_6_09112021

## **Projet 6 - OC : Construisez une API sécurisée pour une application d'avis gastronomiques**

<br>_Sixième projet du parcours "Développeur web" chez [OpenClassrooms](https://openclassrooms.com/fr/paths/185/projects/676/assignment)._</br>

**Contexte de ce projet** :

- Piiquante se dédie à la création de sauces épicées dont les recettes sont gardées
  secrètes.
- Pour tirer parti de son succès et générer davantage de buzz, l'entreprise
  souhaite <br>créer une application web</br> dans laquelle les utilisateurs peuvent ajouter
  leurs sauces préférées et liker ou disliker les sauces ajoutées par les autres.

**Les objectifs de ce projet** :

- Implémenter un modèle logique de données conformément à la réglementation.
- Mettre en œuvre des opérations CRUD de manière sécurisée.
- Stocker des données de manière sécurisée.
- Sécurisation de la base de données selon le RGPD et l’OWASP.

### Installation du projet

#### **FRONT END**

Le repository de la partie front-end est fournie par Openclassrooms. \
1- Cloner le repository du front-end : `git clone https://github.com/OpenClassrooms-Student-Center/Web-Developer-P6 `
2- Installer les dépendances à l'aide des commandes suivantes : `npm install` et `npm install --save-dev run-script-os`

#### **BACK END**

1- Cloner le repository du back-end : `git clone ` \
2- Vérifier si NodeJS et npm sont installés sur votre machine : `node --version && npm --version` \
3- Si vous souhaitez développer, installez Nodemon qui surveillera les modifications de vos fichiers et redémarrera le serveur automatiquement. Vérifiez si nodemon est installé sur votre machine : `npx nodemon --version`, sinon l'installer en lançant `npm install -g nodemon` \
4- Créer un fichier `.env` à la racine du projet qui contiendra les variables d'environnement suivantes: \
(N'indiquez le port que celui-ci s'avère différent par défaut de node.js, à savoir le port 3000)

```
PORT=<valeur_du_port_si_3000_est_déja_occupé>
NAME_DATABASE=<nom_de_votre_base_de_données>
USER_DB=<votre_identifiant_de_base_de_données>
PASSWORD_DB=<votre_mot_de_passe_de_base_de_données>
SECRET_TOKEN=<votre_cle_secrete_pour_générer_token_authentification>
SECRET_NAME=<nom_de_session>
SECRET_SESSION=<phrase_secrète_de_session>
```

### **Les Prérequis pour la réalisation de ce projet**:

Quelques dépendances devront être installées au préalable avant de procéder à la mise en place de ce projet:

- NodeJS 12.14 ou 14.0.
- CLI angular 7.0.2.
- node-sass : assurez-vous d'utiliser la version correspondante à NodeJS. Pour Node 14.0 par exemple, vous avez besoin de node-sass dans la version 4.14+.
- Sous Windows, ces installations nécessitent d'utiliser PowerShell en mode administrateur.
- Ensuite, clonez ce référentiel, lancez `npm install`, et `npm install --save-dev run-script-os`.

### **Les spécifications techniques et exigences de sécurité demandées dans la réalisation de ce projet**:

- API Errors: les erreurs éventuelles doivent être renvoyées telles qu'elles sont produites, sans
  modification ni ajout. Si nécessaire, utilisez une nouvelle Error().
- API Routes: toutes les routes sauce pour les sauces doivent disposer d’une autorisation (le
  token est envoyé par le front-end avec l'en-tête d’autorisation : « Bearer <token> »).
  Avant que l'utilisateur puisse apporter des modifications à la route sauce, le code
  doit vérifier si l'userId actuel correspond à l'userId de la sauce. Si l'userId ne
  correspond pas, renvoyer « 403: unauthorized request. » Cela permet de s'assurer
  que seul le propriétaire de la sauce peut apporter des modifications à celle-ci.

Exigences de sécurité :

- Le mot de passe de l'utilisateur doit être haché.
- L'authentification doit être renforcée sur toutes les routes sauce requises.
- Les adresses électroniques dans la base de données sont uniques et un
  plugin Mongoose approprié est utilisé pour garantir leur unicité et signaler
  les erreurs.
- La sécurité de la base de données MongoDB (à partir d'un service tel que
  MongoDB Atlas) ne doit pas empêcher l'application de se lancer sur la
  machine d'un utilisateur.
- Un plugin Mongoose doit assurer la remontée des erreurs issues de la base
  de données.
- Les versions les plus récentes des logiciels sont utilisées avec des correctifs
  de sécurité actualisés.
- Le contenu du dossier images ne doit pas être téléchargé sur GitHub.

### **Les technologies utilisées**:

- NodeJS, Angular, Postman, MongoDB, le service MondoDb Atlas, le plugin Mongoose.

👉 [L'énoncé du projet](https://openclassrooms.com/fr/paths/185/projects/638/assignment)

👉 [Cahier des charges](https://s3.eu-west-1.amazonaws.com/course.oc-static.com/projects/DWJ_FR_P6/Requirements_DW_P6.pdf)

👉 [Le site déployé sur Github Pages](https://faridbf.github.io/FaridBouras_6_09112021/)
