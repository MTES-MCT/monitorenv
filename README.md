# monitorenv

MonitorEnv est une application développée pour le CACEM afin de centraliser les outils nécessaires à l'exercice de ses missions - la protection de l'environnement marin et le contrôle des activités les plus à risque pour la biodiversité marine -, à savoir:
- l'appui, l'orientation et la coordination des contrôles sur le terrain
- le suivi et le rapportage des missions de contrôle
- l'analyse des données de contrôle, l'aide à la décision et à la définiton des plans de contrôle

MonitorEnv est constituté de deux briques logicielles :
- une application web (MonitorEnv)
- un pipeline de traitement de données (datapipeline).


Le code source de monitorenv est fortement inspiré de [MonitorFish](https://github.com/MTES-MCT/monitorfish). Il en reprend l'architecture ainsi que de nombreux composants. Le code initial doit fortement à ce projet ainsi qu'à leurs auteurs: Loup Théron, Vincent Chéry et Adeline Celier.

# Stack technique (Composants principaux)
- Infra: 
  - docker
- Backend: 
  - Kotlin 
  - Spring 
- PostgreSQL 
- Geoserver
- Frontend:
  - React (Create React App)
  - OpenLayers
  - Rsuite
- Datapipeline:
  - python 3.10
  - poetry
  - prefect

# Installation de l'environnement de développement

## Prérequis
- npm
- openjdk
- docker + docker-compose
- python 3.10 + poetry

## Configuration

Créer un fichier `./infra/.env` à partir de `./infra/.env.template`
Modifier éventuellement `./infra/configurations/backend/application-dev.properties`

## Frontend

`make dev-install` : installation des dépendances du Frontend
`make dev-run-front` : lance le serveur de développement du frontend
Le navigateur s'ouvre par défaut sur l'url http://localhost:3000

### Variables d'environnement
React CRA permet d'introduire des variables d'environnement au build.
Afin de permettre l'utilisation de variables d'environnement au run time de l'application, et d'éviter de compiler l'application frontend pour chaque environnement, les variables sont injectées dans l'application via le fichier `public/env.js` statique chargé par le client. Ce fichier est mis à jour avec les variables d'environnement via un script `env.sh`.
En développement, les variables d'environnement sont injectées via CRA. Le fichier `src/env.js` gère l'import des variables pour l'ensemble de l'application, quelque soit l'environnement (développemnet ou production).

## Backend
Vérifier la configuration : `make dev-back-config`
Lancer le backend :
`make dev-run-back-with-infra`: 
  - supprime éventuellemnt les précédentes instances docker
  - crée une instance docker de la base de donnée + geoserver
  - lance le serveur backend de développement

Le backend est alors accesible sur http://localhost:8880 par défaut.
Une interface Swagger est disponible sur l'url : http://localhost:8880/swagger-ui.html

Il peut être utile de charger des données de contexte pour le développement du frontend, et de configurer Geoserver afin qu'il puisse distribuer ces données.

Pour relancer le backend sans recréer les conteneurs de base de données et geoserver, lancer la commande `make dev-run-back`

```
make load-sig-data
make init-geoserver
```

## Datapipelines

Installer les dépendances :
`make install-pipeline``

Installer les hooks de pre-commit
`cd datascience && poetry run pre-commit install`
# Clean Archi
## UseCases
- UseCases are HOF called with references to Repositories for inverted dependency injection
- UseCases references domain entities
- UseCases return domain entities

