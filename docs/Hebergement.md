Hébergement
================

Notre hébergement se fait sur site par une équipe de la DSI. Nous avons pour charge de gérer la configuration en lien
avec notre application.

## Informations générales

L'accès à l'application se fait via le navigateur en https. Les utilisateurs doivent pouvoir accéder à l'application via
le Réseau Interministériel de l'Etat (RIE).

## Spécificité du serveur

| Type de composant | Intégration | Production |
|-------------------|-------------|------------|
| VCPU              | 3           | 3          |
| RAM               | 3           | 16Go       |
| Disque            | 3           | 100Go      |

## Organisation des déploiements

Les déploiements se font par visioconférence avec un membre de l'équipe de la DSI.

## Gestion des logs

Les logs générés par notre application sont disponibles en consultation
sur [Kibana](http://csam-kibana.csam.e2.rie.gouv.fr). Afin de
suivre
les logs uniquement de MonitorEnv il faut séléctionner le filtre `Logs monitorenv` ou sélectionné à la main le filtre
`application` puis saisir 'monitorenv'.
Les erreurs levées par les postes clients sont consultables sur l'instance Sentry du MTES-MCT

## Backups

Un script de backup est exécuté via un cronjob tous les jours. Il faut cependant que toutes les variables nécessaires à
son bon fonctionnement soient présentes sur la machine hôte.

## Sécurité

L'application est en phase d'homologation afin d'être connecté au
service [Cerbère](https://authentification.din.developpement-durable.gouv.fr/authSAML/cgu.do).
En local, une instance Keycloak fait office de pro
