# REDMI — Gestion de versions & suivi des déploiements (GDP)

> Ce document “REDMI” (mode d’emploi) décrit comment utiliser l’application et comprendre le comportement de ses fonctionnalités principales.

## 1) Objectif de l’application

L’application permet de :

- Gérer des **Projets**.
- Gérer des **Versions** d’un projet (draft / published / archived).
- Associer des **Release Notes** ordonnées et des **Attachments** (PDF/Doc/Docx) à chaque version.
- Piloter un suivi d’état par **Environnement** (DEV/TEST/INT/PROD) :
  - Quelle version est **active** dans chaque environnement.
  - L’**historique** (timeline) des **déploiements**.
- Notifier (email) lors de la publication d’une version.
- Afficher les **notifications** utilisateur (lecture / marquage lu).

## 2) Prérequis

### Backend

- PHP (Laravel)
- MySQL (base de données)
- Stockage local `public` (pour les fichiers uploadés via API)
- Variables d’environnement (définies via `.env`)

### Frontend

- Node.js / npm
- Build Vite + React

## 3) Accès & authentification

### Endpoints (côté API)

- `POST /api/v1/register` : création utilisateur
- `POST /api/v1/login` : connexion

### Frontend

- Routes protégées : toute page fonctionnelle passe par `ProtectedRoute` (présence de `localStorage.user`).
- Routes publiques : `/login`, `/signup`.

## 4) Navigation principale (Frontend)

Pages principales :

- **Dashboard** : accueil après login.
- **Projects** : liste des projets.
- **Project Versions** : versions d’un projet.
- **Suivi des environnements** (ProjectEnvironmentTracking) :
  - carte par environnement + badge “DÉPLOYÉ / VIDE”
  - timeline des déploiements
  - modal pour “Déployer une version”

## 5) Gestion des projets

### Création

- Champ requis : `name`
- Champs optionnels : `description`, `is_active`
- Le backend génère un `slug` depuis le nom.

### API

- `GET /api/v1/projects` : liste + (versions limitées) + count
- `POST /api/v1/projects`
- `GET /api/v1/projects/{id}`
- `PUT /api/v1/projects/{id}`
- `DELETE /api/v1/projects/{id}`

## 6) Gestion des versions

### Statuts

- `draft`
- `published`
- `archived`

### Comportement clé

- À la création d’une version en statut `published`, l’application envoie un email (via `VersionPublishedEmailNotifier`).
- Publication / archivage via des endpoints dédiés.

### API

Routes imbriquées :

- `GET /api/v1/projects/{project}/versions`
- `POST /api/v1/projects/{project}/versions`
- `GET /api/v1/projects/{project}/versions/{version}`
- `PUT /api/v1/projects/{project}/versions/{version}`
- `DELETE /api/v1/projects/{project}/versions/{version}`
- `POST /api/v1/projects/{project}/versions/{version}/publish`
- `POST /api/v1/projects/{project}/versions/{version}/archive`

## 7) Release Notes (par version)

- Les release notes sont **ordonnées** via champ `order`.
- Lorsqu’un `order` n’est pas fourni, le backend incrémente automatiquement au max + 1.

### Types acceptés

- `feature`
- `bugfix`
- `improvement`
- `breaking`

### API

Imbriqué sous `versions/{version}` :

- `GET /api/v1/v1/versions/{version}/notes` (selon routage réel dans `routes/api.php`)
- `POST .../notes`
- `PUT .../notes/{note}`
- `DELETE .../notes/{note}`
- `POST .../notes/reorder`

> Dans le code : le contrôleur gère `index`, `store`, `show`, `update`, `destroy`, `reorder`.

## 8) Attachments (par version)

### Types supportés

- `pdf`, `doc`, `docx`

### Stockage

- Upload via `AttachmentController@store` dans `disk('public')` sous `attachments/{versionId}/...`

### Téléchargement

- `download` renvoie un flux `response()->download()`.

### API

Sous `versions/{version}` :

- `GET /api/v1/versions/{version}/attachments`
- `POST /api/v1/versions/{version}/attachments`
- `DELETE /api/v1/versions/{version}/attachments/{attachmentId}`
- `GET /api/v1/versions/{version}/attachments/{attachmentId}/download`

## 9) Environnements & déploiements

### Environnements

Enregistrements dans la table `environments` :

- `DEV`
- `TEST`
- `INT`
- `PROD`

Chaque environnement a un `code`, un `name`, et un `sort_order`.

### Notion de “version active”

Une version active par environnement et par projet est stockée dans `environment_versions` :

- unique : `unique(project_id, environment_id)`
- champs : `version_id`, `activated_at`, `activated_by`

### Déploiement (timeline)

Un déploiement historique est stocké dans `deployments` :

- `project_id`
- `environment_id`
- `version_id`
- `deployed_at`
- `deployed_by`
- `status` : `success | rollback | failed`
- `metadata` JSON (optionnel)

### API

Côté backend, pour un projet :

- `GET /api/v1/projects/{project}/environments` :
  - retourne les environnements triés
  - pour chaque environnement :
    - version active (si présente)
    - dernier déploiement (si présent)
- `GET /api/v1/projects/{project}/deployments?environmentCode=DEV` (param optionnel)
- `POST /api/v1/projects/{project}/deployments` : création déploiement + activation

### Schéma payload modal (Frontend)

Quand l’utilisateur clique “Déployer une version” :

- `environmentCode`: `DEV|TEST|INT|PROD`
- `versionId`: id de la version
- `status`: `success|rollback|failed`
- `deployedAt`: ISO string (date de création)
- `metadata`: JSON optionnel

## 10) Notifications (lecture)

- `GET /api/v1/notifications` : liste paginée
- `GET /api/v1/notifications/unread-count` : compteur non lu
- `POST /api/v1/notifications/{notification}/read` : marquer lu
- `POST /api/v1/notifications/mark-all-read` : tout marquer lu

## 11) Points d’attention (comportement actuel)

- Le front “ProtectedRoute” se base sur `localStorage.user`.
- Les endpoints d’auth renvoient `token: 'no-token-needed'` (donc intégration token à compléter si besoin futur).
- `EnvironmentController@index` fait une boucle par environnement pour calculer `activeVersion` (peut être optimisable si gros volumes).
- Le modal “Déployer une version” déclenche un refresh des données (environnements + deployments).

## 12) Checklist rapide d’utilisation (résumé)

1. Se connecter.
2. Ouvrir **Projects**.
3. Sélectionner un projet.
4. Ouvrir **Suivi des environnements**.
5. Vérifier la version active par environnement.
6. Ouvrir le modal “Déployer une version”.
7. Choisir une version + statut + metadata optionnelle.
8. Valider : l’API crée le déploiement et met à jour l’activation.
9. Consulter la timeline et l’état “DÉPLOYÉ / VIDE”.