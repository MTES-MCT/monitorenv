# Stratégie pour récupérer les données avec des relations

date: 25/01/2024

## Statut

Résolu

## Contexte

Un problème de performance sur la récupération des données avec des relations a été identifié lorsque RapportNav a tenté de récupérer des missions depuis l'api publique. La recherche de missions via un findAll pouvait prendre jusqu'à 70 secondes.

Sur le jeu de test, récupérer 54 missions déclenchait plus de 260 requêtes.

Le modèle des missions s'appuie sur de nombreuses relations, ce qui multiplie le problème classiquement nommé 'N+1 queries performance problem'. Ce problème est lié au fait que sans stratégie particulière, Hibernate va faire un premier select pour récupérer les missions (le 1 de N+1), puis un select par relation pour récupérer les données liées (le N de N+1).

## Stratégies identifiées

### Stratégie 1 : ne pas utiliser l'ORM pour les requêtes de type findAll

Le problème de N+1 requêtes ne se pose que dans le cas où l'on va rechercher plusieurs entités. Dans le cas où l'on recherche une seule entité, le problème ne se pose pas, puisque dans le pire des cas, on aura une requête pour récupérer l'entité, et une requête par relation, ce qui ne sera jamais supérieur au nombre de relations, donc prédictible et maitrisé.

Cela pose un certain nombre de problèmes :
Cette stratégie implique d'écrire manuellement les requêtes en "native query" SQL ou JPQL, en décidant manuellement les éventuelles jointures à faire, et surtout en réalisant manuellement le mapping entre les données récupérées et les entités.

Aujourd'hui, avec l'architecture hexagonale actuelle, on repasse par les entités du domaine pour faire le mapping. Il n'existe "qu'une seule" version des entités métiers dans le domaine: on ne peut pas faire le mapping vers les entités métiers du domaine en récupérant uniquement les données utiles dans le cas du findAll. Il faudrait donc des DTO spécifiques pour les requêtes de type findAll, ce qui implique de dupliquer le code de mapping, et donc de maintenir deux versions des entités métiers. Il existe peut être une autre méthode plus élégante pour faire le mapping, mais elle n'a pas été identifiée à ce jour.

Réécrire les requêtes de type findAll en requêtes SQL permettrait de résoudre le problème de performance, mais au prix d'une perte de maintenabilité et de lisibilité du code.

### Stratégie 2 : utiliser l'ORM en utilisant les NamedEntityGraphs

Hibernate propose une fonctionnalité permettant de définir des NamedEntityGraphs, qui permettent de définir les relations à charger lors de la récupération d'une entité. Cela permet de résoudre le problème de N+1 queries, puisque l'on peut définir les relations à charger lors de la récupération d'une entité.

**Prérequis :**
Lorsqu'il y a plusieurs relations, Hibernate peut avoir des difficultés à récupérer les données avec une seule requête si les relations `oneToMany` renvoient des `List` (erreur `cannot simultaneously fetch multiple bags`). Il faut retourner des `Set` pour que Hibernate puisse faire la jointure. La différence est que les `List` sont ordonnées à la différence des `Set`. Cela peut créer des effets de bords sur les retours d'API. Pour éviter ce problème, il est possible de demander à Hibernate d'ordonner les données dans les `Set` en utilisant l'annotation `@OrderBy` sur les relations `oneToMany`.
Pour certains éléments d'une relation many-to-many implémentée avec une table intermédiaire et des relations `oneToMany` et `@ManyToOne`, l'ordre du `Set` a un sens métier. Dans ce cas, il faut ajouter une colonne qui sera un index pour ordonner les données. Cela permet de garder l'ordre métier. Le plus simple est d'utiliser une colonne de type serial. Si ce n'est pas la colonne d'`@Id`, il faut ajouter `insertable = false, updatable = false` sur la colonne pour laisser la gestion du serial à la db (et éviter l'erreur du type `order_index is null but db require not null`).

**`@Fetch(FetchMode.SUBSELECT)`:**
L'annotation indique à Hibernate de faire une seule requête pour récupérer les données de la relation à partir de la requête principale.
(`SELECT * FROM relation where id in (SELECT id FROM parent WHERE initial_where_condition)`)
L'annotation doit être ajoutée sur les relations `oneToMany` qui sont chargées avec la requête principale.

**`FetchType.LAZY`:**
L'annotation permet de définir que la relation ne doit pas être chargée lors de la récupération de l'entité. **Il faut ajouter cette annotation sur toutes les relations tant que l'on n'a pas identifié que la stratégie `FetchType.EAGER` était plus adaptée**.

**`@NamedEntityGraph`:**
L'annotation permet de définir quels sont les attributs qui doivent être initialisés lors de la récupération de l'entité.
Elle est ajoutée sur la classe de l'entité.
Elle prend en paramètre le nom de l'entity graph et la liste des attributs à charger.
Il peut y avoir plusieurs graphs définis sur une même entité. (non testé)

**`@NamedAttributeNode`:**
L'annotation permet de définir quels sont les attributs qui doivent être initialisés lors de la récupération de l'entité. Si l'entité chargée comporte également des relations et que l'on veut maitriser quelles relations doivent être chargées, alors il faut ajouter un `subgraph` qui permettra de définir les relations à charger au niveau n+1.

**`@EntityGraph(value = "MissionModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)`:**

L'annotation permet de définir quel graph doit être utilisé par la requête. L'annotation est ajoutée au niveau de la définition de la requête (avant le `@Query`au niveau de l'interface du repository).

`EntityGraph.EntityGraphType.LOAD` permet d'override le type de `FetchType` défini sur les relations. Les relations définies dans le graph seront chargées, les autres seront traitées comme définies dans la classe de l'entité (d'où l'importance de défnir `FetchType.LAZY` par défaut).

**TroubleShooting :**
Intellij semble avoir des difficultés à identifier les attributs dans le graph lorsqu'ils sont sur des relations de deuxième niveau. Les tests disent la vérité.

## Décisions

1. Utiliser la stratégie 2 pour les requêtes de type findAll
2. Compter le nombre de requêtes pour identifier les requêtes qui ne sont pas optimisées

Pour ce deuxième point, un compteur doit être injecté dans les tests `JpaXXXRepositoryITests`via `@Import(DataSourceProxyBeanPostProcessor::class)`.
