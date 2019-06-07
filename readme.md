# Chatbot Ferraris-Luciani

## Installation
Pour l'installer il faut lancer la commande suivante dans le dossier racine du projet :

    npm install
    
Pour lancer le serveur d'administartion il faut ensuite lancer la commande :

    npm run start
    
ou

    node admin/bin/www
    
## Où mettre les cerveaux (fichier .rive) les identifiants Discord ?
Les fichiers rivescript (ou cerveaux) sont stocké dans bot/brain

Les tokens de connection aux bots discord sont stocké dans un dictionnaire JSON
où la clé est le nom du bot Discord et le champ est le token utilisé pour s'y connecter.

## Commandes pour la partie adminisatration

#### obtenir l'etat des bots

      curl -X GET http://localhost:3000/status
      
renvois un json avec les informations de chaque bot : 
* nom 
* port
* etat du serveur du bot
* nom des bots discord connectés à ce bot
                                                      

#### Créer/Demarrer le bot :nombot 

    curl -X POST http://localhost:3000/:nombot/start
    
Permet de démarrer un serveur web identifié par le nom :nombot.

Si le bot existe déjà on allume le serveur en chargeant ses varibles, ses cerveaux et sur le port qui lui est réservé.
Sinon on en créer un nouveau avec le cerveau "default.rive"

#### Arrêter le serveur du bot :nombot
    
    curl -X PATCH http://localhost:3000/:nombot/stop
      
Arrête le serveur http du bot s'il est lancé. Enregistre sur un fichier de sauvegarde ":nombot.json"
son port, son nom, ses cerveaux et ses variables utilisateur.

#### Supprimer le bot :nombot

    curl -X DELETE http://localhost:3000/:nombot
    
Arrête le serveur s'il tourne, déconnecte le bot de Discord puis enfin supprime le fichier de sauvegarde à son nom.

#### Changer le cerveau du bot :nombot

    curl -X PUT http://localhost:3000/:nombot/newbrain/:nomcerveau
    
Sauvegarde les varibles utilisateur de l'interpreteur Rivescript courant puis créer un nouvel
interpreteur Rivescript pour y charger le cerveau ":nomcerveau.rive" puis y charge les données utilisateur.

#### Ajouter un cerveau au bot :nombot

    curl -X PUT http://localhost:3000/:nombot/addbrain/:nomcerveau

Ajoute le cerveau ":nomcerveau.rive" à l'interpreteur courant de :nombot.

#### Connecter le bot :nombot au bot Discord :nomdiscord

###### Précondition : pour se connecter au bot Discord :nomdiscord, il faut que son token soit enregistré dans le fichier "bot/token.json"

    curl -X POST http://localhost:3000/:nombot/connect-to/:nomdiscord
    
Va chercher le token de :nomdiscord dans le fichier "token.json" pour ensuite connecter :nombot au bot Discord.

#### Déconnecter le bot :nombot du bot Dsicord :nomdiscord

    curl -X POST http://localhost:3000/:nombot/connect-to/:nomdiscord
    
 Déconnecte :botname de :nomdiscord s'il est connecté. Enregistre sur un fichier de sauvegarde ":nombot.json"
 son port, son nom, ses cerveaux et ses variables utilisateur.
 
 ## Communiquer avec les bots
 Chaque bot a un port qui lui est affecté lors de sa création.
 
 Pour envoyer un message au bot de port 50000 :
 
    curl -X POST -H "Content-type: application/json" -d '{"usr":username, "msg":message}' 'http://localhost:50000'
    
 Il est aussi possible d'ouvrir le fichier chatroom.html dans un navigateur de votre choix pour envoyer des requetes, il ne vous reste plus qu'a rentrer votre identifiant , message et le port d'envoit pour envoyer la requete.   
