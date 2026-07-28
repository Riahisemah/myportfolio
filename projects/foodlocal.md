# 📋 FoodLocal - Documentation Technique Complète

## Version 1.0 - Janvier 2026

---

# 🎯 1. Présentation du Projet

## 1.1 Vision
**FoodLocal** est une plateforme marketplace B2C connectant les producteurs agricoles locaux et éco-responsables avec les consommateurs. L'objectif est de promouvoir les circuits courts, réduire l'empreinte carbone alimentaire et soutenir l'économie locale française.

## 1.2 Proposition de Valeur

| Pour les Consommateurs | Pour les Producteurs |
|------------------------|----------------------|
| Accès à des produits frais et locaux | Vente directe sans intermédiaires |
| Carte interactive des producteurs | Dashboard de gestion complet |
| Système de notation et avis | Visibilité auprès des consommateurs locaux |
| Messagerie directe avec producteurs | Abonnement mensuel abordable (49€) |

## 1.3 Modèle Économique
- **Commission plateforme** : 10% sur chaque commande (payé par le consommateur)
- **Abonnement producteur** : 49€/mois pour la visibilité sur la plateforme

---

# 🏗️ 2. Architecture Technique

## 2.1 Stack Technologique

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│  React 18 + Tailwind CSS + Shadcn/UI + Recharts + Leaflet       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND                                  │
│  FastAPI (Python 3.11) + Pydantic + JWT + Motor (async MongoDB) │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                  │
│                    MongoDB (NoSQL)                               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICES EXTERNES                             │
│  Stripe (Paiements) | Resend (Emails) | OpenStreetMap (Cartes)  │
└─────────────────────────────────────────────────────────────────┘
```

## 2.2 Dépendances Principales

### Backend (requirements.txt)
| Package | Version | Usage |
|---------|---------|-------|
| fastapi | 0.110.1 | Framework API REST |
| motor | 3.3.1 | Driver MongoDB async |
| pydantic | 2.12.0 | Validation des données |
| python-jose | 3.5.0 | JWT tokens |
| passlib | 1.7.4 | Hachage mots de passe |
| stripe | 13.0.1 | Intégration paiements |
| resend | 2.21.0 | Envoi d'emails |
| python-dateutil | 2.9.0 | Manipulation des dates |

### Frontend (package.json)
| Package | Usage |
|---------|-------|
| react | 18.x - Framework UI |
| react-router-dom | Navigation SPA |
| axios | Requêtes HTTP |
| recharts | Graphiques et charts |
| react-leaflet | Cartes interactives |
| @radix-ui/* | Composants Shadcn/UI |
| tailwindcss | Framework CSS |
| sonner | Notifications toast |
| papaparse | Export CSV |

---

# 👥 3. Rôles Utilisateurs et Permissions

## 3.1 Matrice des Permissions

| Fonctionnalité | Visiteur | Consommateur | Producteur | Admin |
|----------------|----------|--------------|------------|-------|
| Voir produits | ✅ | ✅ | ✅ | ✅ |
| Voir carte producteurs | ✅ | ✅ | ✅ | ✅ |
| Commander | ❌ | ✅ | ❌ | ❌ |
| Laisser un avis | ❌ | ✅ | ❌ | ❌ |
| Messagerie | ❌ | ✅ | ✅ | ✅ (modération) |
| Gérer produits | ❌ | ❌ | ✅ | ❌ |
| Dashboard producteur | ❌ | ❌ | ✅ | ❌ |
| Payer abonnement | ❌ | ❌ | ✅ | ❌ |
| Gérer utilisateurs | ❌ | ❌ | ❌ | ✅ |
| Approuver producteurs | ❌ | ❌ | ❌ | ✅ |
| Voir revenus | ❌ | ❌ | ❌ | ✅ |

## 3.2 Workflow d'Approbation Producteur

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Inscription │ ──▶ │   En attente │ ──▶ │   Approuvé   │
│  Producteur  │     │  (Admin)     │     │   (Visible)  │
└──────────────┘     └──────────────┘     └──────────────┘
                            │
                            ▼
                     ┌──────────────┐
                     │    Rejeté    │
                     └──────────────┘
```

---

# 📊 4. Base de Données (MongoDB)

## 4.1 Collections et Schémas

### Collection: `users`
```javascript
{
  "id": "uuid-v4",                    // Identifiant unique
  "email": "user@example.com",        // Email (unique)
  "name": "John Doe",                 // Nom complet
  "password_hash": "bcrypt_hash",     // Mot de passe hashé
  "google_id": "google_oauth_id",     // OAuth Google (optionnel)
  "role": "consumer|producer|admin",  // Rôle utilisateur
  "status": "active|suspended",       // Statut du compte
  "address": "123 Rue Example",       // Adresse
  "coordinates": {                    // Coordonnées GPS
    "lat": 48.8566,
    "lng": 2.3522
  },
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `producers`
```javascript
{
  "id": "uuid-v4",
  "user_id": "ref_users.id",          // Référence utilisateur
  "farm_name": "Ferme Bio du Soleil", // Nom de la ferme
  "description": "Description...",    // Description
  "products_available": ["Tomates"],  // Produits proposés
  "coordinates": {"lat": 48.8, "lng": 2.3},
  "bio_certified": true,              // Certification bio
  "certifications": ["AB", "HVE"],    // Certifications
  "address": "Adresse complète",
  "phone": "+33612345678",
  "approved": true,                   // Approuvé par admin
  "average_rating": 4.5,              // Note moyenne
  "total_reviews": 25,                // Nombre d'avis
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `products`
```javascript
{
  "id": "uuid-v4",
  "producer_id": "ref_producers.id",
  "name": "Tomates Bio",
  "category": "légumes",              // fruits|légumes|viandes|produits-laitiers-oeufs
  "price": 3.50,                      // Prix unitaire
  "unit": "kg",                       // kg|pièce|litre|boîte|barquette
  "stock": 100,                       // Stock disponible
  "description": "Tomates cultivées...",
  "image_url": "https://...",
  "organic": true,                    // Produit bio
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `orders`
```javascript
{
  "id": "uuid-v4",
  "consumer_id": "ref_users.id",
  "items": [
    {
      "product_id": "uuid",
      "product_name": "Tomates Bio",
      "quantity": 2,
      "price": 3.50,
      "producer_id": "uuid"
    }
  ],
  "subtotal": 7.00,                   // Sous-total
  "commission_percentage": 10.0,       // Taux commission
  "commission_amount": 0.70,           // Montant commission
  "total": 7.70,                       // Total avec commission
  "status": "pending|confirmed|preparing|ready|delivered",
  "delivery_address": "Adresse livraison",
  "producer_ids": ["uuid1", "uuid2"], // Producteurs concernés
  "reviewed": false,                   // Commande notée
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `reviews`
```javascript
{
  "id": "uuid-v4",
  "order_id": "ref_orders.id",
  "consumer_id": "ref_users.id",
  "producer_id": "ref_producers.id",
  "quality_rating": 5,                // Note qualité (1-5)
  "delivery_rating": 4,               // Note livraison (1-5)
  "communication_rating": 5,          // Note communication (1-5)
  "overall_rating": 4.67,             // Moyenne calculée
  "comment": "Très bons produits!",
  "moderated": false,                 // Modéré par admin
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `conversations`
```javascript
{
  "id": "uuid-v4",
  "consumer_id": "ref_users.id",
  "producer_id": "ref_producers.id",
  "last_message": "Aperçu message...",
  "last_message_at": "2026-01-25T10:00:00Z",
  "unread_consumer": 2,               // Messages non lus (consommateur)
  "unread_producer": 0,               // Messages non lus (producteur)
  "moderated": false,
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `messages`
```javascript
{
  "id": "uuid-v4",
  "conversation_id": "ref_conversations.id",
  "sender_id": "ref_users.id",
  "sender_role": "consumer|producer",
  "content": "Contenu du message...",
  "read": false,
  "moderated": false,
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `producer_subscriptions`
```javascript
{
  "id": "uuid-v4",
  "producer_id": "ref_producers.id",
  "month": "2026-01",                 // Mois concerné
  "amount": 49.0,                     // Montant
  "status": "pending|paid",           // Statut paiement
  "stripe_session_id": "cs_test_...", // Session Stripe
  "paid_at": "2026-01-25T10:00:00Z",  // Date paiement
  "created_at": "2026-01-25T10:00:00Z"
}
```

### Collection: `platform_config`
```javascript
{
  "id": "uuid-v4",
  "commission_percentage": 10.0,      // % commission plateforme
  "producer_subscription_monthly": 49.0, // Abonnement mensuel
  "updated_at": "2026-01-25T10:00:00Z"
}
```

---

# 🔌 5. API Endpoints

## 5.1 Authentification (`/api/auth/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/auth/register` | Inscription utilisateur | ❌ |
| POST | `/api/auth/login` | Connexion (retourne JWT) | ❌ |
| GET | `/api/auth/me` | Profil utilisateur connecté | ✅ |
| PUT | `/api/auth/profile` | Mise à jour profil | ✅ |
| POST | `/api/auth/google` | OAuth Google | ❌ |

## 5.2 Produits (`/api/products/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/products` | Liste produits (filtrable) | ❌ |
| GET | `/api/products/{id}` | Détail produit | ❌ |
| GET | `/api/products/by-producer/{id}` | Produits d'un producteur | ❌ |
| POST | `/api/products` | Créer produit | ✅ Producteur |
| PUT | `/api/products/{id}` | Modifier produit | ✅ Producteur |
| DELETE | `/api/products/{id}` | Supprimer produit | ✅ Producteur |

## 5.3 Producteurs (`/api/producers/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/producers` | Liste producteurs | ❌ |
| GET | `/api/producers/{id}` | Détail producteur | ❌ |
| GET | `/api/producers/{id}/reviews` | Avis producteur | ❌ |
| GET | `/api/producers/me` | Profil producteur connecté | ✅ Producteur |
| POST | `/api/producers/setup` | Créer profil producteur | ✅ |

## 5.4 Commandes (`/api/orders/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/orders` | Mes commandes | ✅ Consommateur |
| GET | `/api/orders/producer` | Commandes reçues | ✅ Producteur |
| POST | `/api/orders` | Créer commande | ✅ Consommateur |

## 5.5 Messagerie (`/api/conversations/*`, `/api/messages/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/conversations` | Liste conversations | ✅ |
| POST | `/api/conversations` | Créer/ouvrir conversation | ✅ Consommateur |
| GET | `/api/conversations/{id}/messages` | Messages conversation | ✅ |
| POST | `/api/conversations/{id}/messages` | Envoyer message | ✅ |
| GET | `/api/messages/unread-count` | Compteur non lus | ✅ |

## 5.6 Avis (`/api/reviews/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/reviews` | Créer avis | ✅ Consommateur |
| GET | `/api/reviews/order/{id}` | Avis d'une commande | ✅ |

## 5.7 Abonnements (`/api/subscriptions/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/subscriptions/my-status` | Statut abonnement | ✅ Producteur |
| POST | `/api/subscriptions/pay` | Payer abonnement (Stripe) | ✅ Producteur |
| GET | `/api/subscriptions/status/{session_id}` | Vérifier paiement | ✅ |

## 5.8 Paiements (`/api/payment/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| POST | `/api/payment/create-checkout` | Créer session paiement | ✅ |
| GET | `/api/payment/status/{session_id}` | Statut paiement | ✅ |
| POST | `/api/webhook/stripe` | Webhook Stripe | ❌ |

## 5.9 Administration (`/api/admin/*`)

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/admin/users` | Liste utilisateurs | ✅ Admin |
| PUT | `/api/admin/users/{id}/suspend` | Suspendre utilisateur | ✅ Admin |
| PUT | `/api/admin/users/{id}/activate` | Activer utilisateur | ✅ Admin |
| DELETE | `/api/admin/users/{id}` | Supprimer utilisateur | ✅ Admin |
| GET | `/api/admin/producers/pending` | Producteurs en attente | ✅ Admin |
| PUT | `/api/admin/producers/{id}/approve` | Approuver producteur | ✅ Admin |
| PUT | `/api/admin/producers/{id}/reject` | Rejeter producteur | ✅ Admin |
| GET | `/api/admin/orders/all` | Toutes les commandes | ✅ Admin |
| PUT | `/api/admin/orders/{id}/status` | Modifier statut commande | ✅ Admin |
| GET | `/api/admin/revenue/stats` | Statistiques revenus | ✅ Admin |
| GET | `/api/admin/subscriptions` | Liste abonnements | ✅ Admin |
| PUT | `/api/admin/subscriptions/{id}/mark-paid` | Marquer payé | ✅ Admin |

---

# 📁 6. Structure des Fichiers

```
/app/
├── backend/
│   ├── server.py                 # API principale (FastAPI)
│   ├── requirements.txt          # Dépendances Python
│   ├── .env                      # Variables d'environnement
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py            # Modèles Pydantic
│   ├── utils/
│   │   ├── __init__.py
│   │   ├── auth.py               # JWT, hachage passwords
│   │   ├── database.py           # Connexion MongoDB
│   │   └── helpers.py            # Fonctions utilitaires
│   ├── routers/                  # (À compléter - routes modulaires)
│   │   └── __init__.py
│   └── tests/
│       └── test_subscriptions_and_notifications.py
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js                # Composant racine + routes
│   │   ├── App.css               # Styles globaux
│   │   ├── index.js              # Point d'entrée
│   │   ├── components/
│   │   │   ├── ui/               # Composants Shadcn/UI
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── tabs.jsx
│   │   │   │   └── ...
│   │   │   ├── Navbar.jsx        # Navigation (adaptée au rôle)
│   │   │   ├── ReviewModal.jsx   # Modal notation commande
│   │   │   ├── ReviewsList.jsx   # Liste des avis
│   │   │   └── StarRating.jsx    # Composant étoiles
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Page d'accueil
│   │   │   ├── AuthPage.jsx      # Connexion/Inscription
│   │   │   ├── ProductsPage.jsx  # Catalogue produits
│   │   │   ├── ProducersMap.jsx  # Carte des producteurs
│   │   │   ├── Cart.jsx          # Panier
│   │   │   ├── ConsumerDashboard.jsx  # Dashboard consommateur
│   │   │   ├── ProducerDashboard.jsx  # Dashboard producteur
│   │   │   ├── ProducerSetup.jsx      # Configuration producteur
│   │   │   ├── MessagesPage.jsx       # Messagerie
│   │   │   ├── ProfilePage.jsx        # Profil utilisateur
│   │   │   ├── AdminDashboard.jsx     # Admin - Utilisateurs
│   │   │   ├── AdminProducers.jsx     # Admin - Producteurs
│   │   │   ├── AdminOrders.jsx        # Admin - Commandes
│   │   │   ├── AdminRevenueEnhanced.jsx # Admin - Revenus
│   │   │   ├── CreateFirstAdmin.jsx   # Création admin initial
│   │   │   ├── PresentationPage.jsx   # Page présentation
│   │   │   └── PaymentSuccess.jsx     # Confirmation paiement
│   │   └── utils/
│   │       └── auth.js           # Services authentification
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env
│
├── memory/
│   └── PRD.md                    # Product Requirements
│
├── test_reports/
│   ├── iteration_1.json
│   ├── iteration_2.json
│   └── iteration_3.json
│
└── PRESENTATION_FOODLOCAL.md     # Document présentation
```

---

# ⚙️ 7. Configuration Environnement

## 7.1 Variables Backend (`/app/backend/.env`)

```env
# Base de données
MONGO_URL="mongodb://localhost:27017"
DB_NAME="foodlocal_db"

# CORS
CORS_ORIGINS="*"

# Sécurité
JWT_SECRET="votre-cle-secrete-jwt-production-64-caracteres"
ADMIN_SECRET_KEY="cle-creation-admin"

# Stripe (Paiements)
STRIPE_API_KEY="sk_live_..."   # Clé live pour production
# STRIPE_API_KEY="sk_test_..." # Clé test pour développement

# Resend (Emails)
RESEND_API_KEY="re_..."        # Clé API Resend
SENDER_EMAIL="noreply@votredomaine.com"
```

## 7.2 Variables Frontend (`/app/frontend/.env`)

```env
REACT_APP_BACKEND_URL="https://votre-domaine.com"
```

---

# 🚀 8. Installation Locale

## 8.1 Prérequis
- Python 3.11+
- Node.js 18+
- MongoDB 6+
- Git

## 8.2 Installation Backend

```bash
# Cloner le projet
git clone <repository_url>
cd app/backend

# Créer environnement virtuel
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou: venv\Scripts\activate  # Windows

# Installer dépendances
pip install -r requirements.txt

# Configurer .env (copier et modifier)
cp .env.example .env

# Lancer le serveur
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

## 8.3 Installation Frontend

```bash
cd app/frontend

# Installer dépendances
yarn install  # ou npm install

# Configurer .env
echo "REACT_APP_BACKEND_URL=http://localhost:8001" > .env

# Lancer le serveur de développement
yarn start  # ou npm start
```

## 8.4 Initialisation Base de Données

```bash
# Démarrer MongoDB
mongod --dbpath /path/to/data

# Initialiser les données de test (optionnel)
curl -X POST http://localhost:8001/api/seed-data
```

---

# 🔐 9. Intégrations Tierces

## 9.1 Stripe (Paiements)

### Configuration
1. Créer un compte sur [stripe.com](https://stripe.com)
2. Récupérer les clés API (Dashboard > Developers > API Keys)
3. Configurer `STRIPE_API_KEY` dans `.env`

### Fonctionnalités utilisées
- **Checkout Sessions** : Paiement sécurisé des commandes et abonnements
- **Webhooks** : Notifications de paiement (optionnel)

### Flux de paiement
```
Client → Créer session → Redirection Stripe → Paiement → Retour success_url → Vérification statut
```

## 9.2 Resend (Emails)

### Configuration
1. Créer un compte sur [resend.com](https://resend.com)
2. Ajouter et vérifier votre domaine
3. Récupérer la clé API
4. Configurer `RESEND_API_KEY` et `SENDER_EMAIL`

### Types d'emails
| Type | Déclencheur |
|------|-------------|
| Nouveau message | Envoi d'un message dans une conversation |
| Mise à jour commande | Changement de statut par l'admin |
| Confirmation paiement | Paiement abonnement réussi |

## 9.3 OpenStreetMap / Leaflet (Cartes)

- **Aucune clé API requise** (open source)
- Utilise les tuiles OpenStreetMap
- Géocodage via geocode.xyz

---

# 🧪 10. Tests

## 10.1 Comptes de Test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@foodlocal.fr | admin123456 |
| Producteur | producteur.test@foodlocal.fr | test123456 |
| Consommateur | consumer.test@foodlocal.fr | test123456 |

## 10.2 Tests API (curl)

```bash
# Login
curl -X POST http://localhost:8001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"consumer.test@foodlocal.fr","password":"test123456"}'

# Avec token
TOKEN="votre_jwt_token"
curl -X GET http://localhost:8001/api/auth/me \
  -H "Authorization: Bearer $TOKEN"

# Liste produits
curl http://localhost:8001/api/products

# Liste producteurs
curl http://localhost:8001/api/producers
```

## 10.3 Rapports de Tests
Les rapports de tests automatisés sont disponibles dans `/app/test_reports/`:
- `iteration_1.json` : Tests initiaux
- `iteration_2.json` : Tests messagerie et avis
- `iteration_3.json` : Tests abonnements et emails

---

# 📈 11. Évolutions Futures (Roadmap)

## Court terme (P1)
- [ ] Configurer les intégrations en mode production
- [ ] Déploiement sur serveur de production

## Moyen terme (P2)
- [ ] Application mobile (React Native)
- [ ] Système de géolocalisation en temps réel
- [ ] Notifications push

## Long terme (P3)
- [ ] Programme de fidélité
- [ ] Marketplace multi-langues
- [ ] Analytics avancés pour producteurs
- [ ] Intégration de livraison (API transporteurs)

---

# 📞 12. Support et Contact

Pour toute question technique concernant ce projet, veuillez contacter :
- **Email** : [votre email]
- **Documentation API** : `/api/docs` (Swagger UI auto-généré)

---

*Document généré le 25 janvier 2026*
*Version 1.0*