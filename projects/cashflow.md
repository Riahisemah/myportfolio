# 📱 CashFlow Quest — Rapport Technique Complet pour Publication App Store

**Date** : 23 Mars 2026  
**Version** : 1.0.0  
**Bundle ID** : `com.cashflowquest.app`

---

## 📋 Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble)
2. [Architecture technique](#2-architecture-technique)
3. [Structure des fichiers](#3-structure-des-fichiers)
4. [Écrans de l'application](#4-écrans-de-lapplication)
5. [Flux utilisateur](#5-flux-utilisateur)
6. [API Backend — Endpoints complets](#6-api-backend)
7. [Base de données MongoDB](#7-base-de-données)
8. [Système de monétisation (Freemium)](#8-système-de-monétisation)
9. [Authentification](#9-authentification)
10. [Dashboard Admin](#10-dashboard-admin)
11. [Intégrations tierces](#11-intégrations-tierces)
12. [Variables d'environnement](#12-variables-denvironnement)
13. [Configuration App Store / Google Play](#13-configuration-stores)
14. [Étapes de publication](#14-étapes-de-publication)
15. [Tâches restantes avant publication](#15-tâches-restantes)
16. [Identifiants de test](#16-identifiants-de-test)

---

## 1. Vue d'ensemble

**CashFlow Quest** est une application mobile éducative gamifiée qui enseigne la littératie financière. L'objectif est d'apprendre aux utilisateurs à sortir de la "rat race" à travers des scénarios financiers progressifs, des quiz, un simulateur de vie financière et des conseils IA personnalisés.

### Fonctionnalités principales
- 🎮 **Scénarios financiers progressifs** — Situations de vie réelle avec choix et conséquences
- 📝 **Quiz financiers** — Questions à choix multiples avec explications
- 💰 **Simulateur de vie** — Portfolio financier avec investissements et simulation mensuelle
- 🤖 **Conseils IA** — Analyse personnalisée via GPT-4o
- 🏆 **Classement & Succès** — Leaderboard et badges débloquables
- 💎 **Système Premium** — Freemium avec paywall et abonnements
- 👤 **Authentification** — Email/Password avec JWT
- 🎯 **Mode Invité** — Jouer sans compte, puis sauvegarder sa progression
- 📊 **Dashboard Admin** — Statistiques, gestion utilisateurs, activité

### Langues
- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais

---

## 2. Architecture technique

```
┌─────────────────────────────────────────────────┐
│                 FRONTEND                         │
│         Expo (React Native) + TypeScript         │
│              Expo Router (file-based)            │
│                  Port: 3000                      │
├─────────────────────────────────────────────────┤
│                 BACKEND                          │
│          FastAPI (Python 3.11)                   │
│          Uvicorn ASGI Server                     │
│               Port: 8001                         │
│        Préfixe routes: /api/*                    │
├─────────────────────────────────────────────────┤
│                DATABASE                          │
│           MongoDB (Motor async)                  │
│         Base: cashflow_quest                     │
├─────────────────────────────────────────────────┤
│              SERVICES EXTERNES                   │
│     OpenAI GPT-4o (via Emergent LLM Key)        │
│          RevenueCat (À INTÉGRER)                │
└─────────────────────────────────────────────────┘
```

### Stack technique

| Composant | Technologie | Version |
|-----------|------------|---------|
| Frontend | Expo (React Native) | SDK 54 |
| Langage Frontend | TypeScript | 5.9.3 |
| Navigation | Expo Router | 6.0.22 |
| State Management | Zustand | 5.0.11 |
| Animations | React Native Reanimated | 4.1.1 |
| Animations Lottie | lottie-react-native | 7.3.6 |
| Audio | expo-av | 16.0.8 |
| HTTP Client | Axios | 1.13.6 |
| Backend | FastAPI | 0.110.1 |
| Serveur ASGI | Uvicorn | 0.25.0 |
| Base de données | MongoDB (Motor) | 3.3.1 |
| Auth | JWT (python-jose) | 3.3.0 |
| Hashing | Bcrypt (passlib) | 4.1.3 |
| IA | OpenAI GPT-4o (emergentintegrations) | 0.1.0 |

---

## 3. Structure des fichiers

```
/app
├── backend/
│   ├── server.py              # Serveur FastAPI monolithique (3133 lignes, 62 endpoints)
│   ├── requirements.txt       # Dépendances Python
│   └── .env                   # Variables d'environnement backend
│
└── frontend/
    ├── app.json               # Configuration Expo / App Store
    ├── package.json           # Dépendances Node.js
    ├── .env                   # Variables d'environnement frontend
    ├── assets/
    │   ├── images/
    │   │   ├── icon.png            # Icône app (1024x1024)
    │   │   ├── adaptive-icon.png   # Icône Android adaptive (1024x1024)
    │   │   ├── splash-image.png    # Splash screen (1284x2778)
    │   │   ├── splash-icon.png     # Icône splash (400x400)
    │   │   └── favicon.png         # Favicon web (48x48)
    │   └── animations/            # Fichiers Lottie (.json)
    ├── src/
    │   ├── stores/
    │   │   └── userStore.ts       # Store Zustand (état global utilisateur)
    │   └── utils/
    │       ├── api.ts             # Instance Axios avec intercepteurs Auth/403
    │       └── sounds.ts          # Gestion audio (expo-av)
    └── app/                       # Écrans (file-based routing)
        ├── _layout.tsx            # Layout racine
        ├── index.tsx              # Page d'accueil / Landing
        ├── login.tsx              # Connexion
        ├── signup.tsx             # Inscription (+ mode guest upgrade)
        ├── forgot-password.tsx    # Mot de passe oublié
        ├── onboarding.tsx         # Onboarding (profil financier)
        ├── premium-onboarding.tsx # Onboarding Premium (Lottie)
        ├── paywall.tsx            # Paywall 6 blocs marketing
        ├── scenario.tsx           # Jeu de scénarios financiers
        ├── quiz.tsx               # Quiz financiers
        ├── simulator.tsx          # Simulateur de vie financière
        ├── ai-analysis.tsx        # Analyse IA personnalisée
        ├── financial-profile.tsx  # Profil financier détaillé
        ├── support.tsx            # FAQ & Contact
        ├── admin.tsx              # Dashboard admin (protégé par mdp)
        └── (tabs)/                # Navigation principale (onglets)
            ├── _layout.tsx        # Layout tab bar
            ├── index.tsx          # Dashboard (accueil connecté)
            ├── games.tsx          # Liste des jeux (scénarios/quiz)
            ├── journey.tsx        # Parcours / Étapes
            ├── leaderboard.tsx    # Classement
            └── profile.tsx        # Profil utilisateur + Paramètres
```

---

## 4. Écrans de l'application

### Écrans publics (non authentifiés)
| Écran | Route | Description |
|-------|-------|-------------|
| Landing | `/` | Page d'accueil avec CTA "Commencer l'aventure" et "Se connecter" |
| Login | `/login` | Connexion email/mot de passe |
| Signup | `/signup` | Inscription (accepte `?guest_user_id=xxx` pour upgrade guest) |
| Forgot Password | `/forgot-password` | Réinitialisation mot de passe |

### Écrans principaux (tabs)
| Écran | Route | Description |
|-------|-------|-------------|
| Dashboard | `/(tabs)` | Net Worth, Cash Flow, Niveau, XP, Défi quotidien |
| Jeux | `/(tabs)/games` | Liste scénarios et quiz, compteurs de limites gratuites |
| Parcours | `/(tabs)/journey` | Étapes de progression |
| Classement | `/(tabs)/leaderboard` | Top joueurs |
| Profil | `/(tabs)/profile` | Avatar, stats, paramètres, Support, Logout/Save |

### Écrans de jeu
| Écran | Route | Description |
|-------|-------|-------------|
| Scénario | `/scenario` | Scénario financier avec choix multiples |
| Quiz | `/quiz` | 5 questions financières |
| Simulateur | `/simulator` | Portfolio, investissements, simulation mensuelle |
| Analyse IA | `/ai-analysis` | Conseils IA personnalisés (GPT-4o) |

### Écrans spéciaux
| Écran | Route | Description |
|-------|-------|-------------|
| Onboarding | `/onboarding` | Configuration profil financier initial |
| Premium Onboarding | `/premium-onboarding` | Animations Lottie storytelling |
| Paywall | `/paywall` | 6 blocs marketing (Mensuel/Annuel/Founder) |
| Support | `/support` | FAQ (8 questions, 4 catégories) + Formulaire contact |
| Admin | `/admin` | Dashboard admin protégé par mot de passe |

---

## 5. Flux utilisateur

### 5.1 Flux Invité (Guest)
```
App ouverte → Landing → "Commencer l'aventure"
    → Onboarding (profil financier)
    → Premium Onboarding (animations Lottie)
    → Dashboard (tabs) — jouer en mode invité
    → Profil → "Sauvegarder ma progression"
    → Inscription (email/mdp) — données liées au compte
    → Retour Dashboard (avec compte)
```

### 5.2 Flux Inscription directe
```
Landing → "Se connecter" → Login → Dashboard
     ou → "S'inscrire" → Signup → Premium Onboarding → Dashboard
```

### 5.3 Flux Freemium
```
Utilisateur gratuit joue un scénario
    → 1er scénario terminé → Paywall affiché automatiquement
    → Si refuse → Continue à jouer (max 3 scénarios + 5 quiz/jour)
    → Si limite atteinte → Modal "Limite quotidienne"
        → Bouton "Passer Premium" → Paywall
        → Bouton "Revenir plus tard" → Retour
```

### 5.4 Flux Admin
```
URL directe: /admin → Mot de passe admin → Dashboard
    → Vue d'ensemble (KPI, revenus, tendances)
    → Utilisateurs (recherche, filtrage, toggle Premium)
    → Activité (journal temps réel)
```

---

## 6. API Backend — Endpoints complets

**Base URL** : `https://[votre-domaine]/api`

### 🔐 Authentification
| Méthode | Endpoint | Description | Auth requise |
|---------|----------|-------------|:---:|
| POST | `/auth/register` | Inscription (+ `guest_user_id` optionnel) | ❌ |
| POST | `/auth/login` | Connexion → JWT token | ❌ |
| POST | `/auth/forgot-password` | Demande reset mot de passe | ❌ |
| POST | `/auth/reset-password` | Reset mot de passe | ❌ |
| POST | `/auth/google` | Auth Google (placeholder) | ❌ |
| POST | `/auth/apple` | Auth Apple (placeholder) | ❌ |
| GET | `/auth/me` | Profil utilisateur connecté | ✅ JWT |

### 👤 Utilisateurs
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/users` | Créer utilisateur |
| GET | `/users/{user_id}` | Profil utilisateur |
| PUT | `/users/{user_id}/avatar` | Changer avatar |
| PUT | `/users/{user_id}/language` | Changer langue |

### 🎮 Jeux
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/scenarios` | Liste des scénarios |
| GET | `/scenarios/{scenario_id}` | Détail scénario |
| POST | `/scenarios/answer` | Soumettre réponse scénario |
| GET | `/quiz/questions` | Générer questions quiz |
| POST | `/quiz/answer` | Soumettre réponse quiz |

### 💰 Portfolio / Simulateur
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/portfolios/{user_id}` | Portfolio financier |
| POST | `/portfolios/{user_id}/invest` | Faire un investissement |
| POST | `/portfolios/{user_id}/simulate-month` | Simuler un mois |
| POST | `/simulate-month/{user_id}` | Simulation mensuelle |

### 🤖 Intelligence Artificielle
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/ai/advice` | Conseils IA personnalisés (GPT-4o) |
| POST | `/ai/analyze-situation` | Analyse situation financière |

### 💎 Premium / Freemium
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/premium/status/{user_id}` | Statut premium + limites restantes |
| GET | `/premium/usage/{user_id}` | Usage quotidien |
| GET | `/premium/prices` | Tarifs abonnements |
| GET | `/premium/should-show-paywall/{user_id}` | Doit-on afficher le paywall ? |
| POST | `/premium/upgrade/{user_id}` | Upgrade premium (MOCK) |
| POST | `/premium/cancel/{user_id}` | Annuler premium |
| POST | `/premium/track-first-scenario/{user_id}` | Tracker 1er scénario |
| POST | `/premium/dismiss-paywall/{user_id}` | Fermer paywall |

### 📊 Autres
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/financial-profile/{user_id}` | Profil financier |
| POST | `/financial-profile/{user_id}` | Mettre à jour profil financier |
| GET | `/achievements/{user_id}` | Succès / Badges |
| GET | `/leaderboard` | Classement global |
| GET | `/stages` | Étapes de progression |
| GET | `/daily-challenge/{user_id}` | Défi quotidien |
| GET | `/content/unlocked/{user_id}` | Contenu débloqué |

### 🔧 Admin (protégé par JWT admin)
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| POST | `/admin/login` | Connexion admin (mot de passe fixe) |
| GET | `/admin/stats` | Statistiques globales |
| GET | `/admin/users` | Liste utilisateurs (recherche/pagination/filtre) |
| PUT | `/admin/users/{user_id}/premium` | Toggle premium d'un utilisateur |
| GET | `/admin/activity` | Journal d'activité |

### 🏥 Santé
| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/` | Info API |

---

## 7. Base de données MongoDB

### Collections

#### `users`
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "password_hash": "$2b$12...",
  "username": "MonPseudo",
  "language": "fr",
  "avatar_id": 1,
  "level": 5,
  "xp": 450,
  "xp_to_next_level": 500,
  "total_score": 2350,
  "streak_days": 7,
  "is_premium": false,
  "subscription_type": "free",  // "free" | "monthly" | "annual" | "founder" | "admin_granted"
  "subscription_start": null,
  "subscription_end": null,
  "daily_usage": {
    "scenarios_used": 2,
    "quizzes_used": 3,
    "last_reset": "2026-03-23T00:00:00Z"
  },
  "has_completed_first_scenario": true,
  "has_seen_paywall": true,
  "auth_provider": "email",
  "upgraded_from_guest": false,
  "created_at": "2026-03-20T10:00:00Z",
  "last_active": "2026-03-23T15:00:00Z"
}
```

#### `portfolios`
```json
{
  "user_id": "uuid-string",
  "cash": 12500.0,
  "net_worth": 35000.0,
  "monthly_income": 3500.0,
  "monthly_expenses": 2200.0,
  "passive_income": 150.0,
  "debt": 5000.0,
  "investments": [
    {"type": "stocks", "amount": 10000, "return_rate": 0.08},
    {"type": "real_estate", "amount": 15000, "return_rate": 0.05}
  ],
  "assets": [],
  "current_month": 12,
  "created_at": "2026-03-20T10:00:00Z"
}
```

#### `achievements`
```json
{
  "id": "first_steps",
  "user_id": "uuid-string",
  "unlocked": true,
  "progress": 1,
  "target": 1
}
```

---

## 8. Système de monétisation (Freemium)

### Limites gratuites (par jour)
| Fonctionnalité | Limite gratuite | Premium |
|----------------|:-:|:-:|
| Scénarios | 3 / jour | ♾️ Illimité |
| Quiz | 5 / jour | ♾️ Illimité |
| Conseils IA | ❌ Bloqué | ✅ Accès |
| Simulateur avancé | ❌ Bloqué | ✅ Accès |
| Contenu exclusif | ❌ | ✅ |

### Tarifs (à configurer dans RevenueCat)
| Plan | Prix | Product ID suggéré |
|------|------|-------------------|
| Mensuel | 5,99€ / mois | `cashflow_monthly` |
| Annuel | 49,00€ / an (= 4,08€/mois) | `cashflow_annual` |
| Founder (à vie) | 119,00€ (une seule fois) | `cashflow_founder` |

### Paywall — Structure 6 blocs
1. **Header** : Logo + "Passez Premium"
2. **Avantages** : Liste des fonctionnalités débloquées
3. **Témoignages** : Avis utilisateurs (mock)
4. **Comparaison** : Gratuit vs Premium (tableau)
5. **Tarifs** : 3 plans avec CTA
6. **Garantie** : "Satisfait ou remboursé 7 jours"

### ⚠️ IMPORTANT : Le système de paiement est actuellement MOCKÉ
L'endpoint `POST /api/premium/upgrade/{user_id}` simule un paiement réussi. Il faut remplacer par **RevenueCat** (voir section 15).

---

## 9. Authentification

### Système JWT
- **Algorithme** : HS256
- **Expiration** : 30 jours
- **Stockage client** : AsyncStorage (`auth_token`)
- **Intercepteur Axios** : Ajoute automatiquement le header `Authorization: Bearer <token>`

### Flux d'authentification
```
Inscription → API retourne JWT + user_id → Stocké dans AsyncStorage
Connexion → API vérifie email/password → Retourne JWT + user_id
Chaque requête → Intercepteur ajoute JWT dans header
Token expiré → Intercepteur redirige vers Login
403 (limite) → Intercepteur affiche modal limite
```

### Mode Guest → Account Upgrade
Quand un utilisateur invité crée un compte :
1. Le `guest_user_id` est envoyé dans le body de `/auth/register`
2. Le backend met à jour l'utilisateur existant (au lieu d'en créer un nouveau)
3. Toute la progression (XP, niveau, parties, portfolio) est conservée
4. Le même `user_id` est maintenant lié à un email/password

---

## 10. Dashboard Admin

### Accès
- **URL** : `/admin` (pas de lien visible dans l'app)
- **Mot de passe** : Défini dans `ADMIN_PASSWORD` (`.env` backend)
- **Token** : JWT admin séparé (24h d'expiration)

### Fonctionnalités
| Onglet | Données affichées |
|--------|------------------|
| Vue d'ensemble | Utilisateurs totaux, Premium, MRR, Actifs aujourd'hui, Conversion rate, Répartition Premium (Mensuel/Annuel/Founder), Stats joueurs (Niveau/XP moyen), Graphique inscriptions 7j |
| Utilisateurs | Liste complète avec recherche, filtres (Tous/Premium/Gratuits), pagination, toggle Premium avec modal de confirmation |
| Activité | Journal en temps réel : inscriptions, upgrades premium, activité de jeu |

---

## 11. Intégrations tierces

### OpenAI GPT-4o
- **Usage** : Génération de conseils financiers personnalisés et analyse de situations
- **Bibliothèque** : `emergentintegrations` (wrapper Emergent)
- **Clé** : `EMERGENT_LLM_KEY` dans `.env` backend
- **Endpoints concernés** : `/api/ai/advice`, `/api/ai/analyze-situation`

### RevenueCat (À INTÉGRER)
- **Usage** : Gestion des abonnements in-app (App Store + Google Play)
- **SDK** : `react-native-purchases`
- **Statut** : Non intégré — actuellement mockup côté backend
- **Voir** : Section 15 pour les étapes d'intégration

---

## 12. Variables d'environnement

### Backend (`/app/backend/.env`)
```env
MONGO_URL="mongodb://localhost:27017"     # URL MongoDB
MONGO_DB_NAME="cashflow_quest"            # Nom de la base
EMERGENT_LLM_KEY=sk-emergent-xxxxx       # Clé API IA (OpenAI via Emergent)
ADMIN_PASSWORD=CashFlow2024!              # Mot de passe admin dashboard

# À ajouter pour production :
JWT_SECRET_KEY=votre-clé-secrète-jwt      # Clé secrète JWT (CHANGER en prod!)
```

### Frontend (`/app/frontend/.env`)
```env
EXPO_PUBLIC_BACKEND_URL=https://votre-domaine.com    # URL du backend
# Les variables EXPO_PACKAGER_* sont gérées par Expo
```

---

## 13. Configuration App Store / Google Play

### app.json — Déjà configuré ✅
```json
{
  "name": "CashFlow Quest",
  "slug": "cashflow-quest",
  "version": "1.0.0",
  "bundleIdentifier": "com.cashflowquest.app",     // iOS
  "package": "com.cashflowquest.app",               // Android
  "userInterfaceStyle": "dark",
  "orientation": "portrait"
}
```

### Assets Store — Déjà générés ✅
| Asset | Taille | Fichier |
|-------|--------|---------|
| Icône App | 1024x1024 | `icon.png` |
| Icône Adaptive Android | 1024x1024 | `adaptive-icon.png` |
| Splash Screen | 1284x2778 | `splash-image.png` |
| Splash Icon | 400x400 | `splash-icon.png` |
| Favicon Web | 48x48 | `favicon.png` |

### Textes pour les stores

**Nom** : CashFlow Quest

**Sous-titre** (30 car.) : Maîtrisez vos finances

**Description courte** (80 car.) :
> Apprenez à gérer votre argent et échappez à la rat race grâce à des jeux éducatifs !

**Description longue** :
> 🎮 CashFlow Quest est un jeu éducatif gamifié qui vous apprend à gérer votre argent, investir intelligemment et atteindre la liberté financière.
>
> 💡 Apprenez par la pratique grâce à des scénarios financiers réalistes. Chaque décision impacte votre patrimoine et votre cash flow.
>
> 🧠 Testez vos connaissances avec des quiz financiers progressifs et obtenez des conseils personnalisés grâce à l'intelligence artificielle.
>
> 📊 Simulez votre vie financière : investissez en bourse, dans l'immobilier, créez des revenus passifs et regardez votre patrimoine grandir mois après mois.
>
> 🏆 Défiez d'autres joueurs dans le classement et débloquez des succès en progressant.
>
> ✨ FONCTIONNALITÉS :
> • Scénarios financiers interactifs
> • Quiz avec explications détaillées
> • Simulateur de patrimoine financier
> • Conseils IA personnalisés
> • Classement global et succès
> • Mode gratuit généreux (3 scénarios + 5 quiz/jour)
> • Premium pour un accès illimité
>
> 🇫🇷 Disponible en français et en anglais.
>
> Commencez votre quête vers la liberté financière dès maintenant !

**Mots-clés** : finance, éducation, investissement, argent, gestion, budget, bourse, immobilier, liberté financière, jeu éducatif

**Catégorie principale** : Éducation  
**Catégorie secondaire** : Finance

**Classification d'âge** : 4+ (pas de contenu sensible)

**Permissions déclarées** :
- iOS : `NSCameraUsageDescription` = "Personnalisez votre avatar avec une photo"
- Android : Aucune permission spéciale requise

---

## 14. Étapes de publication

### Prérequis
- [ ] Compte Apple Developer ($99/an) → [developer.apple.com](https://developer.apple.com)
- [ ] Compte Google Play Developer ($25 une fois) → [play.google.com/console](https://play.google.com/console)
- [ ] Compte Expo (EAS) → [expo.dev](https://expo.dev)
- [ ] Compte RevenueCat → [app.revenuecat.com](https://app.revenuecat.com)

### Étape 1 : Configurer EAS
```bash
# Installer EAS CLI
npm install -g eas-cli

# Se connecter
eas login

# Initialiser le projet
cd frontend
eas init

# Mettre à jour le projectId dans app.json > extra > eas > projectId
```

### Étape 2 : Configurer RevenueCat (AVANT le build)
```bash
# Installer le SDK
npx expo install react-native-purchases

# Ajouter dans app.json > plugins :
# ["react-native-purchases", { "iap": true }]
```

Puis dans le code :
1. Initialiser RevenueCat avec la clé API au démarrage de l'app
2. Remplacer le mock `premium/upgrade` par les achats RevenueCat
3. Vérifier les receipts côté backend

### Étape 3 : Build iOS
```bash
# Configurer les credentials Apple (certificats, provisioning)
eas credentials

# Build pour soumission
eas build --platform ios --profile production

# Soumettre à l'App Store
eas submit --platform ios
```

### Étape 4 : Build Android
```bash
# Build pour soumission
eas build --platform android --profile production

# Soumettre à Google Play
eas submit --platform android
```

### Étape 5 : Configurer les produits in-app
#### App Store Connect
1. Aller dans App Store Connect → Votre app → Abonnements
2. Créer un groupe d'abonnements "CashFlow Quest Premium"
3. Ajouter les produits :
   - `cashflow_monthly` — 5,99€/mois
   - `cashflow_annual` — 49,00€/an
   - `cashflow_founder` — 119,00€ (non-renouvelable)
4. Configurer dans RevenueCat

#### Google Play Console
1. Aller dans Google Play Console → Votre app → Monétisation → Produits
2. Créer les mêmes produits d'abonnement
3. Configurer dans RevenueCat

### Étape 6 : Mettre à jour les variables d'environnement production
```env
# Backend .env (production)
MONGO_URL=mongodb+srv://user:password@cluster.mongodb.net/cashflow_quest
JWT_SECRET_KEY=une-clé-secrète-très-longue-et-aléatoire
ADMIN_PASSWORD=un-vrai-mot-de-passe-admin-sécurisé
EMERGENT_LLM_KEY=votre-clé-production

# Frontend .env (production)  
EXPO_PUBLIC_BACKEND_URL=https://api.cashflowquest.app
REVENUECAT_IOS_KEY=appl_xxxxx
REVENUECAT_ANDROID_KEY=goog_xxxxx
```

---

## 15. Tâches restantes avant publication

### 🔴 Priorité haute (Bloquantes)

| # | Tâche | Détail | Effort estimé |
|:-:|-------|--------|:---:|
| 1 | **Intégrer RevenueCat** | Remplacer le mock payment par de vrais achats in-app. Installer `react-native-purchases`, initialiser au démarrage, connecter au paywall. | 3-5 jours |
| 2 | **Changer JWT_SECRET_KEY** | La clé actuelle est hardcodée dans `server.py`. Déplacer vers `.env` et utiliser une clé aléatoire forte en production. | 30 min |
| 3 | **Déployer le backend** | Actuellement en local. Déployer sur un serveur (Railway, AWS, Render...) avec MongoDB Atlas. | 1-2 jours |
| 4 | **Apple Sign-In** | Obligatoire si l'app propose d'autres méthodes de connexion sociale. Les endpoints `/auth/apple` et `/auth/google` sont des placeholders. | 2-3 jours |
| 5 | **Screenshots App Store** | Prendre des captures d'écran aux bonnes dimensions pour App Store et Google Play (6.7", 6.5", 5.5", iPad). | 1 jour |

### 🟡 Priorité moyenne

| # | Tâche | Détail | Effort estimé |
|:-:|-------|--------|:---:|
| 6 | **Refactoring backend** | `server.py` fait 3133 lignes. Séparer en modules (auth, premium, games, admin, ai). | 2-3 jours |
| 7 | **Formulaire contact backend** | Le formulaire Support envoie actuellement en mock. Connecter à un service email (SendGrid, SES). | 1 jour |
| 8 | **Push Notifications** | Rappels quotidiens, notification de streak, nouveaux contenus. | 2-3 jours |
| 9 | **Tests unitaires** | Ajouter des tests backend (pytest) et frontend (jest). | 2-3 jours |
| 10 | **Politique de confidentialité** | Obligatoire pour App Store. Créer une page web. | 1 jour |
| 11 | **Conditions d'utilisation** | Obligatoire pour App Store. Créer une page web. | 1 jour |

### 🔵 Priorité basse (Post-lancement)

| # | Tâche | Détail |
|:-:|-------|--------|
| 12 | Google Sign-In | Authentification Google OAuth |
| 13 | Analytics | Intégrer un outil d'analytics (Mixpanel, Amplitude) |
| 14 | Deep Linking | Liens profonds pour partage et marketing |
| 15 | Mode Hors Ligne | Cache local des scénarios et quiz |
| 16 | Contenu additionnel | Plus de scénarios, quiz, et niveaux |

---

## 16. Identifiants de test

### Utilisateur test
```
Email: support-test@example.com
Password: Test123!
```

### Admin Dashboard
```
URL: /admin
Password: CashFlow2024!
```

### Créer un nouveau compte test
```bash
curl -X POST https://[votre-domaine]/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"nouveau@test.com","password":"Test123!","username":"NouveauTest"}'
```

---

## 📝 Notes importantes pour le développeur

1. **Ne JAMAIS utiliser `Alert.alert()`** pour les confirmations sur mobile — utiliser un composant `<Modal>` React Native (bug connu sur Expo Go Android).

2. **Le `server.py` est monolithique** — L'ordre d'inclusion des routes est important. Le `app.include_router(api_router)` DOIT être à la fin du fichier.

3. **Les intercepteurs Axios** dans `api.ts` gèrent automatiquement :
   - L'ajout du token JWT dans chaque requête
   - La redirection vers Login si token expiré (401)
   - L'affichage du modal de limite si 403

4. **Le champ `isGuest`** dans le userStore est calculé dynamiquement à partir de la présence/absence de `auth_token` dans AsyncStorage.

5. **Les sons** utilisent `expo-av` (pas `expo-audio`) — vérifié fonctionnel sur iOS et Android natif.

6. **Les animations Lottie** dans `premium-onboarding.tsx` utilisent des fichiers JSON depuis un CDN LottieFiles.

---

*Document généré le 23 Mars 2026 — CashFlow Quest v1.0.0*