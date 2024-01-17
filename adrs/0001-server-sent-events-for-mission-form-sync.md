# Utilisation de Server-Sent Events (SSE) pour la synchronisation du formulaire missions

Date: 17/01/2024

## Statut

Résolu, à améliorer.

## Contexte

Pour synchroniser les formulaires de missions de MonitorFish et MonitorEnv, nous mettons en place :
1. Une sauvegarde en temps réel (automatique) du formulaire lors de chaque modification
2. Une mise-à-jour en temps réel (automatique) du formulaire lorsqu'un autre utilisateur a modifié la même mission

Pour le point 2., une URL de réception d'évenements doit être mise en place dans les APIs MonitorEnv.

Il est possible d'utiliser :
- `Websocket`
- Server-Sent Events (`SSE`)

### Utiliser `Websocket`

`Websocket` est un protocole non-HTTP bidirectionnel. Il requiert l'ajout de nouvelles librairies dans le frontend et le backend pour le gérer.

### Utiliser `SSE`

`SSE` utilise le protocole HTTP. Il est de plus est géré nativement par `Spring Boot`, côté backend et par le frontend, avec `EventSource`.

**Limitations** :
Lors de l'envoi d'un message, il faut fermer la connexion HTTP ouverte (voir `sseEmitter.complete()`), sinon le message n'est pas envoyé avec la configuration `Spring Boot` actuelle.  
La conséquence est que côté frontend, à chaque évenement reçu, un message de type `error` (qui déclenche `onerror`) est également reçu.
Cet évenement nous oblige à re-créer une nouvelle connexion `EventSource`.

## Décision

`SSE` parait plus approprié à notre utilisation, par contre la re-créatino d'une connexio HTTP à chaque message reçu est une limitation majeure. 

## Conséquences

Etant donné que l'instance `EventSource` est utilisé à plusieurs endroits dans le code,
il faut re-créer des `EventListener` dans les composants qui écoutent les events à chaque message reçu.   
Cela peut entrainer des phénomênes de **race condition**.

Pour éviter cela, il faudra à l'avenir :
- Eviter cette fermeture de connexion par le backend
- Passer à `Websocket`
