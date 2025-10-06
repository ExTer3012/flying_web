# Flying WEB - Système de Réservation de Vols

## Technologies Choisies

### Backend
- **PHP 8.x** : Langage principal pour le développement backend
- **MySQL** : Base de données relationnelle pour stocker les informations
- **Laravel 10.x** : Framework PHP pour une architecture MVC robuste
- **Composer** : Gestionnaire de dépendances PHP

### Frontend
- **HTML5/CSS3** : Structure et style des pages web
- **JavaScript (ES6+)** : Interactivité côté client
- **Bootstrap 5** : Framework CSS pour le responsive design
- **jQuery** : Manipulation DOM et requêtes AJAX

### Outils et Bibliothèques
- **TCPDF ou DomPDF** : Génération des cartes d'embarquement PDF
- **PHPMailer** : Envoi d'emails avec pièces jointes
- **Endroid QR Code** : Génération des QR codes pour les cartes d'embarquement
- **JWT (JSON Web Tokens)** : Génération de tokens sécurisés pour les liens de réservation

## Justification des Choix Technologiques

### Pourquoi PHP et Laravel ?
- **Écosystème mature** : PHP dispose d'une large communauté et de nombreuses bibliothèques
- **XAMPP compatible** : Parfaitement intégré avec l'environnement de développement existant
- **Laravel Eloquent ORM** : Facilite la gestion des relations complexes entre entités (avions, aéroports, vols, passagers)
- **Système d'authentification intégré** : Laravel fournit des mécanismes robustes pour l'authentification backend
- **Validation et règles métier** : Système de validation avancé pour implémenter les règles de gestion complexes

### Pourquoi MySQL ?
- **Relations complexes** : Support natif des clés étrangères et contraintes d'intégrité
- **Transactions ACID** : Nécessaire pour les opérations critiques comme les réservations
- **Performance** : Optimisé pour les requêtes de recherche de vols avec filtres multiples
- **Intégration XAMPP** : Disponible par défaut dans l'environnement de développement

### Pourquoi Bootstrap ?
- **Responsive Design** : Requis par le cahier des charges
- **Composants prêts** : Formulaires, tableaux, modales pour l'interface d'administration
- **Compatibilité mobile** : Interface utilisateur adaptée aux différents devices

### Bibliothèques Spécialisées
- **TCPDF/DomPDF** : Génération des cartes d'embarquement avec mise en page professionnelle
- **Endroid QR Code** : Création des QR codes contenant les liens de consultation de réservation
- **PHPMailer** : Envoi sécurisé d'emails avec pièces jointes PDF
- **JWT** : Génération de tokens sécurisés pour les liens uniques dans les emails

## Architecture du Projet

### Structure Backend (Partie Privée)
- Authentification par mot de passe hashé
- CRUD pour les avions et aéroports
- Système de planification des vols
- Gestion des décollages/atterrissages
- Interface d'administration responsive

### Structure Frontend (Partie Publique)
- Moteur de recherche de vols avec filtres
- Système de réservation avec validation
- Génération automatique des cartes d'embarquement
- Envoi d'emails avec liens sécurisés

## Règles de Gestion Implémentées
- Vérification de compatibilité avion/aéroport (dimensions)
- Contrôle des états d'avion (décollage/atterrissage)
- Blocage des modifications après décollage
- Gestion des sièges par vol
- Système de tokens uniques pour les réservations

## Installation et Configuration
1. Configurer XAMPP avec PHP 8.x et MySQL
2. Installer Composer
3. Cloner le projet et installer les dépendances Laravel
4. Configurer la base de données MySQL
5. Exécuter les migrations pour créer les tables
6. Configurer l'envoi d'emails (SMTP)

Ce choix technologique garantit une application robuste, sécurisée et facilement maintenable, répondant à tous les critères d'évaluation du projet.
