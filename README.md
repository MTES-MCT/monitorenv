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

