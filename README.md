# Our Meal Project — Gestion des menus familiaux

Ce dépôt sert à organiser les menus de la famille en tenant compte des goûts et contraintes alimentaires de chacun.

## Structure

- `profiles/` — un fichier par personne (`Leon.md`, `Maxime.md`, `Margaux.md`) contenant :
  - **Date de naissance** : utilisée pour adapter les menus à l'âge de la personne (ex. repas adaptés à un jeune enfant pour Léon)
  - **Préférences** : aliments aimés / aliments à éviter
  - **Particularités** : régime alimentaire (végétarien, végan, allergies, intolérances, etc.)
- `menus/` — historique des menus générés et de leurs listes de courses associées (voir `menus/README.md` pour la convention de nommage)

Ces fichiers doivent être tenus à jour au fil des envies et contraintes de chacun ; ils servent de base à la génération des menus.

## Fonctionnement de la génération d'un menu

Quand une demande de menu est faite, les informations suivantes sont d'abord demandées avant de générer quoi que ce soit :

1. **Type d'alimentation souhaité** pour la semaine (normal, végétarien, végan, sans porc, etc.), en tenant compte des profils dans `profiles/`.
2. **Nombre de repas à générer** (petit déjeuner, déjeuner, dîner) et sur combien de jours.
3. **Souhait d'entrée ou non** pour les repas.
4. **Souhait de dessert** pour les repas concernés.
5. **Collations** souhaitées sur la semaine (oui/non, combien).

Une fois ces réponses obtenues :

- Un **menu de la semaine** est proposé (dans la conversation, pas encore archivé), respectant les préférences, particularités et **l'âge** de chaque profil (les repas pour un jeune enfant comme Léon sont adaptés en conséquence : textures, quantités, absence d'aliments non recommandés à son âge, etc.).

### Validation du menu avant génération finale

- Ce menu proposé est **soumis à validation** : il n'est ni archivé, ni accompagné de recettes ou de liste de courses à ce stade.
- L'utilisateur peut alors :
  - **Valider** le menu tel quel, ou
  - **Demander des modifications** (ex. changer un plat précis, un jour précis, remplacer une entrée, etc.).
- Si des modifications sont demandées, un **nouveau menu** est proposé en reprenant à l'identique tout ce qui n'a pas été concerné par la demande, et en ne modifiant que les éléments explicitement demandés par l'utilisateur.
- Ce cycle (proposition → demande de modification → nouvelle proposition) se répète autant de fois que nécessaire, jusqu'à validation explicite du menu par l'utilisateur.

Une fois le menu **validé** :

- Pour chaque plat du menu validé, la **recette** correspondante est fournie (ingrédients avec quantités et étapes de préparation), afin de pouvoir réaliser directement les plats du menu.
- Une **liste de courses** correspondante est générée à partir des ingrédients du menu.
- Le menu et sa liste de courses sont **archivés dans `menus/`** pour être retrouvés facilement par la suite.
