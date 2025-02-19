Sommaire
============

MonitorEnv s'articule autour de 3 éléments principaux

- Data pipeline
- Back end
- Front End

Data pipeline
-------------

Le service de traitement des données exécute des tâches python par lots pour récupérer des données de sources externes

Les tâches par lots sont orchestrées par [Prefect](https://prefect.io). Pour plus d'information voir la
[documentation](<https://docs.prefect.io/orchestration/>).
L'interface utilisateur de Prefect permet aux administrateurs de visualiser chaque flux sous la forme d'un diagramme des
tâches qui le composent, de surveiller leur exécution, de consulter les journaux et de déboguer en cas d'échec de l'
exécution d'un flux.

* python 3.8.7
* [SQLAlchemy](https://www.sqlalchemy.org/>), une boîte à outils SQL en python pour interagir avec les bases de données
  SQL
* Adaptateurs de base de données: [cx_Oracle](<https://oracle.github.io/python-cx_Oracle/>)
  et [psycopg2](<https://github.com/psycopg/psycopg2/>) pour la connectivité aux bases de données Oracle et PostgreSQL
  respectivement
* [Pandas](<https://pandas.pydata.org/>) pour la manipulation des données en pyhton
* [Prefect python librairie](<https://github.com/prefecthq/prefect>) pour écrire des travaux par lots sous forme de flux
  de tâches

Back end
-------------

* Kotlin
* Spring Boot
* Flyway (database migration)
* PostgreSQL with PostGIS/TimescaleDB
* Tomcat (version 9.0.37)

Front end
-------------

* Openlayers
* React

Swagger : https://monitorenv.din.developpement-durable.gouv.fr/swagger-ui/index.html

Sources externes de données
==============================


L'application MonitorEnv utilise des ressources externes pour différentes raisons :

- Récupérer les actions faites par le CNSP et par les unités elle-même au sein d'une mission
  - API MonitorFish (Liste des actions)
  - API RapportNav (Booléen qui indique si l'unioté à créé ou non des actions)

- Récupérer les NATINFS (référentiel des différents types de nature d'infractions) pour les afficher dans l'application
  - Flow Prefect qui va chercher les données dans la base de données FMC (Fishing Monitoring Center) pour les intégrer
    ensuite dans la base de données MonitorEnv


- Récupérer les différentes couches réglementaires (zones réglementaires, AMP), les sémaphores de la base du CROSS
  - Flows prefect qui va chercher les données dans la base de données du CACEM (au CROSS-A)  pour les intégrer ensuite
    dans la base de données MonitorEnv


- Utilisation de google places

Consommateurs de nos apis
==========================

- Les applications MonitorFish et RapportNav consomment des apis de MonitorEnv:
  - API /GET
    - `/missions`: Liste des missions
    - `/missions/find?{missionIds}`: Liste des missions par ids
    - `/missions/{missionId}`: Détails d'une mission, et des actions créées dans MonitorEnv
    - `/missions/{missionId}/can_delete`: Vérification qu'une mission peut être supprimée par la source qui appelle l'
      api (MonitorFish ou RapportNav)
    - `/missions/engaged_control_units`: Liste des unités de contrôle en cours de mission

    - `/administrations`: Liste des administrations
    - `/administrations/{administrationId}`: détails d'une administration
    - `/administrations/{administrationId}/can_delete`: Vérification qu'une administration peut être supprimée
    - `/administrations/{administrationId}/can_archive`: Vérification qu'une administration peut être archivée

    - `/control_plans`: Liste des plans de contrôle (thématiques)
    - `/control_plans/{year}`: Liste des plans de contrôle (thématiques) par année

    - `/control_unit_resources`: Liste des resources des unités de contrôle
    - `/control_unit_resources/{controlUnitResourceId}/can_delete`: Vérification qu'une ressource d'une unité de
      contrôle peut être supprimée
    - `/control_unit_resources/{controlUnitResourceId}`: Détails d'une ressource d'une unité de contrôle

    - `/control_units`: Liste des unités de contrôle (Legacy)
    - `/control_units`: Liste des unités de contrôle
    - `/control_units/{controlUnitId}`: Détails d'une unité de contrôle
    - `/control_units/{controlUnitId}/can_delete`: Vérification qu'une unité de contrôle peut être supprimée

    - `/stations`: Liste des bases
    - `/stations/{stationId}`: Détails d'une base
    - `/stations/{stationId}/can_delete`: Vérification qu'une base peut être supprimée

    - `/control_unit_contacts`: Liste des contacts des unités de contrôle
    - `/control_unit_contacts/{controlUnitContactId}`: Détails des contacts d'une unité de contrôle

    - `/test/trigger_sentry_error`: Permet de vérifier si les erreurs sont bien envoyées à Sentry
    - `/version`: Permet de récupérer la version de l'application

  - API /POST
    - `/missions`: Création d'une mission
    - `/missions/{missionId}`: Modification d'une mission (Legacy)

    - `/administrations`: Création d'une administration

    - `/control_unit_resources`: Création d'une ressource d'une unité de contrôle

    - `/stations`: Création d'une base

    - `/authorization/management`: Création d'un nouvel utilisateur

    - `/control_units`: Création d'une unité de contrôle

    - `/control_unit_contacts`: Création des contacts d'une unité de contrôle

  - API /PUT
    - `/administrations/{administrationId}`: Modification d'une administration
    - `/administrations/{administrationId}/archive`: Archivage d'une administration

    - `/control_unit_resources/{controlUnitResourceId}`: Modification d'une ressource d'une unité de contrôle
    - `/control_unit_resources/{controlUnitResourceId}/archive`: Archivage d'une resource d'une unité de contrôle

    - `/stations/{stationId}`: Modification d'une base

    - `/control_units/{controlUnitId}`: Modification d'une unité de contrôle
    - `/control_units/{controlUnitId}/archive`: Archivage d'une unité de contrôle

  - API /PATCH
    - `/actions/{id}`: Modification des actions ENV d'une mission
    - `/missions/{missionId}`: Modification d'une mission
    - `/control_unit_contacts/{controlUnitContactId}`: Modification des contacts d'une untié de contrôle

  - API /DELETE
    - `/missions/{missionId}`: Suppression d'une mission
    - `/administrations/{administrationId}`: Suppression d'une administration
    - `/control_unit_resources/{controlUnitResourceId}`: Suppression d'une ressource d'une unité de contrôle
    - `/stations/{stationId}`: Suppression d'une base
    - `/authorization/management/{email}`: Suppression d'un utilisateur
    - `/control_units/{controlUnitId}`: Suppression d'une unité de contrôle
    - `/control_unit_contacts/{controlUnitContactId}`: Suppression des contacts d'une unité
