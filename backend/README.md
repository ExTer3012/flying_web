# API Flying Web - Backend Express.js

API REST minimale pour l'application Flying Web.

## nInstallation

```bash
# Installer les dépendances
npm install

# Configurer le fichier .env
# Voir .env pour les variables d'environnement

# Démarrer le serveur
npm start

# Démarrer en mode développement (avec nodemon)
npm run dev
```

## Endpoints API

### Authentication
- `POST /api/auth/login` - Connexion admin

### Avions (CRUD)
- `GET /api/avions` - Liste tous les avions
- `GET /api/avions/:id` - Détails d'un avion
- `POST /api/avions` - Créer un avion (protégé)
- `PUT /api/avions/:id` - Modifier un avion (protégé)
- `DELETE /api/avions/:id` - Supprimer un avion (protégé)

### Aéroports (CRUD)
- `GET /api/aeroports` - Liste tous les aéroports
- `GET /api/aeroports/:id` - Détails d'un aéroport
- `POST /api/aeroports` - Créer un aéroport (protégé)
- `PUT /api/aeroports/:id` - Modifier un aéroport (protégé)
- `DELETE /api/aeroports/:id` - Supprimer un aéroport (protégé)

### Vols
- `GET /api/vols` - Liste tous les vols
- `GET /api/vols/recherche?ville_depart=X&ville_arrivee=Y&date=YYYY-MM-DD` - Rechercher des vols
- `GET /api/vols/:id` - Détails d'un vol
- `POST /api/vols` - Créer un vol (protégé)
- `PUT /api/vols/:id` - Modifier un vol (protégé)
- `PUT /api/vols/:id/decoller` - Faire décoller (protégé)
- `PUT /api/vols/:id/atterrir` - Faire atterrir (protégé)
- `DELETE /api/vols/:id` - Annuler un vol (protégé)

### Réservations
- `GET /api/reservations/token/:token` - Consulter une réservation
- `POST /api/reservations` - Créer une réservation
- `PUT /api/reservations/token/:token` - Modifier une réservation
- `DELETE /api/reservations/token/:token` - Annuler une réservation

## Authentification

Pour les routes protégées, ajouter le header :
```
Authorization: Bearer <token>
```

## Règles de gestion implémentées

- Un avion ne peut pas décoller s'il n'a pas atterri
- Un avion trop grand ne peut pas être affecté à une piste trop courte
- Les réservations ne peuvent plus être modifiées après le décollage
- Attribution automatique des numéros de siège
- Vérification du nombre de places disponibles

## Exemple de requêtes

### Login
```json
POST /api/auth/login
{
  "email": "admin@flyingweb.com",
  "password": "admin123"
}
```

### Créer une réservation
```json
POST /api/reservations
{
  "vol_id": "68eea41465d2ce3f32cebead",
  "nombre_passagers": 2,
  "email_contact": "client@example.com",
  "passagers": [
    { "nom": "Dupont", "prenom": "Jean" },
    { "nom": "Dupont", "prenom": "Marie" }
  ]
}
```

## Port

Le serveur démarre par défaut sur le port **5000**.

## Technologies

- Express.js
- MongoDB avec Mongoose
- JWT pour l'authentification
- bcryptjs pour le hashage des mots de passe
- CORS activé
