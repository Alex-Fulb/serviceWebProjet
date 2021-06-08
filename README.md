

# Projet Service Web 2020/2021  
  
Le présent projet, c'est déroulé dans le cadre de la formation d'ingénieur informatique de deuxième année dispensée par l'ENSSAT.
  
Le sujet de ce projet est l’élaboration de chatbots. Il s'agit d'un travail en collaboration par Alex FULBERT et Marc VACQUANT 
# Sujet  
  
Le but du projet est de créer une interface d'administration pour des bots pouvant par la suite être interfacer avec divers outils (Discord, Sclack...).
## Introduction  
  
Le projet est fait en utilisant NodeJS et avec une architecture REST.
  
## Modifications nécessaires

Le présent programme utilise MongoDB ainsi que Discord, des token autorisation devrons donc être généré et utilisé aux endroits suivants:

 - dans le fichier **.env**
	 - **PORT** représente la valeur local du port utilisé pour l'interface d'administration
	 - **ATLAS_URI** représente la connexion à la BDD
- dans le fichier **config.json** dans *serviceWebProjet/chatBotProjet/backend/discordConfigurationBot/*
	- **prefix** correspond au tag d'appel pour le bot Discord
	- **token** représente le token d'authorisation du bot Discord

 
## Installation des dépendances
  
Dans un premier temps il est nécessaire d'installer les divers modules du programmes pur se faire  il faut utiliser la commande **npm install** dans les dossiers *serviceWebProjet/chatBotProjet/* et *serviceWebProjet/chatBotProjet/backend/*
  
## Lancement

Pour démarrer l'application utiliser **npm run devStart** ou **node server.js** dans *serviceWebProjet/chatBotProjet/backend/*

