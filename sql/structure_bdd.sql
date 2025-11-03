CREATE DATABASE IF NOT EXISTS flying_web2;
USE flying_web2;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS avions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    modele VARCHAR(50) NOT NULL,
    identification VARCHAR(50) NOT NULL UNIQUE,
    nombre_places INT NOT NULL,
    dimension DECIMAL(5,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS aeroports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ville VARCHAR(100) NOT NULL,
    longueur_max DECIMAL(5,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS vols (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_vol VARCHAR(20) NOT NULL UNIQUE,
    aeroport_depart_id INT NOT NULL,
    aeroport_arrivee_id INT NOT NULL,
    avion_id INT NOT NULL,
    date_depart_utc DATETIME NOT NULL,
    date_arrivee_utc DATETIME NOT NULL,
    statut ENUM('planifie', 'en_vol', 'atterri', 'annule', 'retard') DEFAULT 'planifie',
    FOREIGN KEY (aeroport_depart_id) REFERENCES aeroports(id),
    FOREIGN KEY (aeroport_arrivee_id) REFERENCES aeroports(id),
    FOREIGN KEY (avion_id) REFERENCES avions(id)
);

CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vol_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    nombre_passagers INT NOT NULL,
    email_contact VARCHAR(255) NOT NULL,
    statut ENUM('active', 'annulee') DEFAULT 'active'
    FOREIGN KEY (vol_id) REFERENCES vols(id)
);

CREATE TABLE IF NOT EXISTS passagers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_id INT NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    numero_siege VARCHAR(10)
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE
);
