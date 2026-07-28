# Documentation Sequenti

Sequenti est une plateforme de mise en relation pour la transmission d'entreprises, facilitant le lien entre Cédants (vendeurs) et Repreneurs (acheteurs).

## Architecture Technique

### Frontend
- **Framework** : React.js (v18)
- **Stylisation** : Tailwind CSS & Shadcn UI
- **Icônes** : Lucide React
- **Graphiques** : Recharts
- **Gestion des formulaires** : React Hook Form & Zod
- **Client API** : Axios
- **Verification** : Playwright

### Backend
- **Framework** : FastAPI (Python 3.12+)
- **Base de données** : MongoDB (via Motor/Pymongo)
- **Authentification** : JWT (JSON Web Tokens)
- **Emails** : FastAPI-Mail (Templates HTML)
- **Serveur** : Uvicorn

## Fonctionnalités Principales

### Pour les Cédants
- **Simulateur de Valorisation** : Questionnaire en plusieurs étapes pour obtenir une estimation de la valeur de l'entreprise selon trois méthodes (Patrimoniale, Rendement, Comparative).
- **Profil Cédant** : Gestion des informations de l'entreprise et suivi de l'estimation.
- **Prise de rendez-vous** : Intégration Calendly pour un accompagnement personnalisé.

### Pour les Repreneurs
- **Parcours de Qualification** : Questionnaire détaillé permettant de scorer le profil (sur 100) et d'attribuer un niveau (Premium, Qualifié, En construction, Curieux).
- **Catalogue d'Opportunités** : Liste des entreprises à reprendre avec filtrage par secteur et localisation.
- **Manifestation d'Intérêt** : Possibilité de contacter l'administrateur pour une opportunité spécifique.
- **Gestion du NDA** : Système de signature d'accord de confidentialité (NDA) géré dynamiquement.

### Administration
- **Tableau de Bord Global** : Statistiques en temps réel (Pipeline cédants, Qualification repreneurs).
- **Gestion des Utilisateurs** : Validation ou rejet des nouveaux inscrits (Cédants et Repreneurs).
- **Gestion des Opportunités** : Interface CRUD complète pour gérer les annonces.
- **Export de Données** : Export au format XLSX/CSV/JSON de toutes les collections (utilisateurs, intérêts, opportunités).
- **Intégration CRM** : Import automatique et manuel des données vers un CRM externe.
- **Paramètres Système** : Contrôle global de la plateforme (ex: bascule de l'obligation de NDA).
- **Sécurité** : Gestion des accès admin et modification sécurisée des mots de passe.

## Processus Techniques Clés

### Calcul de Valorisation
L'algorithme de valorisation utilise trois méthodes :
1. **Patrimoniale** : Basée sur le CA et le Résultat Net.
2. **Rendement** : Utilise un multiple sectoriel appliqué au Résultat Net ou à l'EBE, pondéré par l'ancienneté.
3. **Comparative** : Basée sur un multiple du Chiffre d'Affaires.

### Système de Scoring (Repreneurs)
Le score est calculé selon plusieurs critères :
- Capacité financière (apport)
- Expérience de management
- Horizon du projet
- Pré-accord bancaire

### Déploiement & Infrastructure
- **Serveur Web** : Nginx (Configuration pour le frontend et proxy inverse pour l'API).
- **Environnement** : Variables d'environnement pour la configuration de la base de données, des secrets JWT et des accès SMTP.