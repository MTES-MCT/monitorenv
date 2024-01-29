# Résoudre le problème de limitation de JPQL sur la gestion des tableaux

Date : 25/01/2024

## Statut

Résolu

## Contexte

Dans le cadre du passage de la recherche de missions en SQL vers JPQL, un problème de limitation de JPQL a été identifié au niveau de l'ajout d'une condition dans la clause `WHERE` pour trouver l'intersection entre un parametre de type `List<MissionTypeEnum>` et une colonne de type `text[]` mappée sur un attribut de type `List<MissionTypeEnum>`.

Il semblerait que la solution de type `myList in mm.missionTypes` ne soit pas supportée par JPQL.

## Décision

Dans le cas rencontré, la solution a été de remplacer le test d'intersection par un test manuel sur chacune des valeurs de l'`enum`.

### Au niveau du repository

un paramètre de type `Boolean` pour chaque élément de l'`enum`:

```kotlin
missionTypeAIR = MissionTypeEnum.AIR in missionTypes.orEmpty(),
```

### Au niveau de la requête JPQL

Test manuel sur chaque élément de l'`enum` converti manuellement en `text`:

```sql
(:missionTypeAIR = TRUE AND ( CAST(mission.missionTypes as String ) like '%AIR%'))
```
