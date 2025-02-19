CICD
================

- Nous utilisons la plateforme Github afin, avant et après chaque demande d'ajout de code, via un WebHook, déclenchement
  périodiquement ou manuelle, d'automatiser les étapes de développement suivantes :
- `build & packaging`
- `test`
- `bonnes pratiques de sécurité`
- `Analyse et bonnes pratiques de développement`
- `release`

## Détail de chaque étape

- **Build et Packaging**
  Avant les autres étapes il est primordial de s'assurer l'application soit compilée et exécutée dans un conteneur
  Docker afin d'être déployable. L'image Docker générée est stockée dans la registry Docker de dépôt Github.

- **Test**
  Les tests unitaires, des tests d'intégration et des tests de bout en bout (e2e) sont déclenchées en parallèle à la
  suite de l'étape de build.

- **Analyse et bonnes pratiques de sécurité**
  Afin de garantir que des secrets / mots de passe ne soit envoyé dans notre dépôt Github nous utilisons GitGardian. Le
  MTES-MCT met à disposition l'outil Snyk pour vérifier les potentielles vulnérabilités provenant du code ou du
  conteneur.

- **Bonnes pratiques de développement**
  Une analyse par l'outil CodeQL (python et typescript) et Sonar assure la qualité du nouveau code écrit et renvoie une
  analyse ainsi qu'une note selon les critères du MTES-MCT.
  Nous poussons les sources maps générées par React à Sentry afin de simplifier la résolution d'erreur sur les postes
  clients.

- **Release**
  Lors d'une release les étapes précédentes sont déclenchées et une image versionnée avec le numéro de la release est
  générée.

## Webhooks

- Sécurité : [Snyk](https://app.snyk.io), [GitGardian](https://www.gitguardian.com/)
- Bonnes pratiques de
  développement : [SonarCloud](https://www.sonarsource.com/products/sonarcloud/), [CodeQL](https://www.codeql.github.com)

## Déclenchement périodique

- Mise à jour des dépendances : [Dependabot](https://github.com/dependabot)

## Déclenchement manuelle

- Analyse de sécurité (CVE) des images docker : [Trivy](https://www.trivy.dev)

## Limites

Notre hébergement se fait sur site par une équipe de la DSI donc nous ne déployons pas continuellement. Nous nous
limitons à la création d'une release en vue d'un déploiement.
