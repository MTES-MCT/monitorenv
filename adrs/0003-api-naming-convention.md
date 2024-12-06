# Proposition de convention de naming des routes

Convention de nommage des routes pour une API RESTful

- nom du chemin (request path) en snake_case
- nom du chemin au pluriel si possible, correspondant au nom de l'entité principale métier
- nom du chemin au singulier si la ressource est unique (`/preview`, `/search`, `/missions/:id/archive`)
- pas d'écriture en base à partir des requêtes GET (archiver se fait sur une requête PUT)

## Définition des ressources

5 endpoints pour une ressource
Donc 5 définitions de méthode par fichier de ressource au maximum

| Verbe HTTP| Request Path       | Controller Name   | Usage                     |
|-----------|--------------------|-------------------|---------------------------|
| GET       | /missions/:id      | get               | display a specific mission|
| GET       | /missions          | getAll            | list all missions         |
| POST      | /missions          | create            | create a new mission      |
| PATCH/PUT | /missions/:id      | update            | update a specific mission |
| DELETE    | /missions/:id      | delete            | delete a specific mission |

## Définition du scope des ressources

Possibilité de définir un scope pour les ressources

## Autres propositions

L'arborescence reprend le chemin des urls

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
