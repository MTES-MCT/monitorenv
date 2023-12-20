# Proposition de convention de naming des routes

Convention de nommage des routes pour une API RESTful

- nom du chemin en minuscule
- nom du chemin au pluriel si possible, correspondant au nom de l'entité principale métier

## Définition des ressources

5 endpoints pour une ressource
Donc 5 définitions de méthode par fichier de ressource au maximum

Verbe HTTP| Request Path       | Controller Name   | Usage

GET       | /missions          | getAll            | list all missions
POST      | /missions          | create            | create a new mission
GET       | /missions/:id      | get               | display a specific mission
PATCH/PUT | /missions/:id      | update            | update a specific mission
DELETE    | /missions/:id      | delete            | delete a specific mission

## Définition du scope des ressources

Possibilité de définir un scope pour les ressources

## Autres propositions

Arborescence:
  
```
- endpoints
  - bff
    - v1
      - Missions 
        **le nom du package est le nom de la ressource de base (request path)**
        **on retire le suffixe "Controller", car le package n'est jamais appelé directement**
       - Archive
        pour les ressources nestées on crée un répertoire avec le nom de la ressource parent
  - publicapi (pourrait être renommé "api")
    - v1
      - Missions
        - Archive
```
