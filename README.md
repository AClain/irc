## irc

_Projet réalisé dans le cadre de la formation Web@cadémie, Epitech. En équipe avec Mona Baly ([github](https://github.com/Mona-src))_

## Description

Ce projet a pour but de répliquer le fonctionnement d'un IRC (ou chat instantanné, voir [Internet Relay Chat](https://fr.wikipedia.org/wiki/Internet_Relay_Chat)).
Il possède une interface graphique ainsi qu'un système de commande pour naviguer entre les salles de discussion.

## Utilisation

Après avoir rentré un nom valide (n'étant pas déjà pris), plusieurs commandes sont disponibles:
* /create _nom_channel_
  * Créé un nouveau channel avec pour nom _nom_channel_,
* /join _nom_channel_
  * Rejoint le channel _nom_channel_,
* /rename _nom_channel_ _nouveau_nom_
  * Renomme le channel _nom_channel_ en _nouveau_nom_,
* /part _nom_channel_
  * Quitte le channel _nom_channel_,
* /delete _nom_channel_
  * Supprime le channel _nom_channel_,
* /nick _nouveau_nom_
  * Renomme l'utilisateur en _nouveau_nom_,
* /users
  * Affiche la liste des utilisateurs connectés au channel / serveur,
* /list [_string_]
  * Affiche la liste des channels disponibles. Si _string_ est donné en paramètre, affiche
  la liste des channels contenant _string_ dans leur nom,
* /msg _nom_utilisateur_ _message_
  * Envoie _message_ à _nom_utilisateur_,
* _message_
  * Envoie un message dans le channel courant.
  
## Autres

+ Support des emojis,
+ Support du bbcode (voir [BBCode](https://fr.wikipedia.org/wiki/BBCode)),
+ Autocomplétion des channels / utilisateurs avec @ et # en début de message,
+ Autolink dans channels / utilisateurs dans les messages envoyés.
