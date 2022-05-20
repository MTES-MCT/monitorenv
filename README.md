# monitorenv


# Stack technique
- Backend: 
  - Kotlin 
  - Spring 
- PostgreSQL 
- Geoserver
- Frontend:
  - React (Create React App)

# Installation

## Prérequis
- npm
- openjdk
- docker + docker-compose

## Configuration

Créer un fichier `./infra/.env` à partir de `./infra/.env.template`
Modifier éventuellement `./infra/configurations/backend/application-dev.properties`

## Frontend

`make install` : installation des dépendances du Frontend
`make run-front-dev` : lance le serveur de développement du frontend
Le navigateur s'ouvre par défaut sur l'url http://localhost:3000

### Variables d'environnement
React CRA permet d'introduire des variables d'environnement au build.
Afin de permettre l'utilisation de variables d'environnement au run time de l'application, et d'éviter de compiler l'application frontend pour chaque environnement, les variables sont injectées dans l'application via le fichier `public/env.js` statique chargé par le client. Ce fichier est mis à jour avec les variables d'environnement via un script `env.sh`.
En développement, les variables d'environnement sont injectées via CRA. Le fichier `src/env.js` gère l'import des variables pour l'ensemble de l'application, quelque soit l'environnement (développemnet ou production).

## Backend

`make run-back-with-infra`: 
  - supprime éventuellemnt les précédentes instances docker
  - crée une instance docker de la base de donnée + geoserver
  - lance le serveur backend de développement

Le backend est alors accesible sur http://localhost:8880 par défaut.
Une interface Swagger est disponible sur l'url : http://localhost:8880/swagger-ui.html
# Clean Archi
## UseCases
- UseCases are HOF called with references to Repositories for inverted dependency injection
- UseCases references domain entities
- UseCases return domain entities

