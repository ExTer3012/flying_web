-- ============================================
-- Base de données Flying WEB
-- Système de réservation de vols
-- Optimisé pour MySQL Workbench
-- ============================================

-- Suppression de la base si elle existe (pour MySQL Workbench)
DROP DATABASE IF EXISTS flying_web;

-- Création de la base de données
CREATE DATABASE flying_web CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE flying_web;

-- ============================================
-- TABLE: utilisateurs (Utilisateurs administrateurs)
-- ============================================
CREATE TABLE utilisateurs (
    id_utilisateur INT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL COMMENT 'Mot de passe hashé',
    nom VARCHAR(255) NOT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_utilisateur),
    UNIQUE INDEX email_UNIQUE (email ASC)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Utilisateurs administrateurs du système';

-- ============================================
-- TABLE: aeroports (Aéroports)
-- ============================================
CREATE TABLE aeroports (
    id_aeroport INT NOT NULL AUTO_INCREMENT,
    code_iata VARCHAR(10) NOT NULL COMMENT 'Code IATA (ex: CDG, ORY)',
    nom VARCHAR(255) NOT NULL,
    ville VARCHAR(255) NOT NULL,
    pays VARCHAR(255) NOT NULL,
    longueur_piste_max DECIMAL(8,2) NOT NULL COMMENT 'Longueur maximale de piste en mètres',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_aeroport),
    UNIQUE INDEX code_iata_UNIQUE (code_iata ASC),
    INDEX idx_ville (ville ASC),
    INDEX idx_pays (pays ASC)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Aéroports avec leurs caractéristiques techniques';

-- ============================================
-- TABLE: avions (Avions)
-- ============================================
CREATE TABLE avions (
    id_avion INT NOT NULL AUTO_INCREMENT,
    modele VARCHAR(100) NOT NULL COMMENT 'Modèle (A320, A315, B747, etc.)',
    immatriculation VARCHAR(50) NOT NULL COMMENT 'Immatriculation unique',
    capacite_passagers INT NOT NULL,
    longueur DECIMAL(8,2) NOT NULL COMMENT 'Dimension en mètres',
    statut ENUM('disponible', 'en_vol', 'maintenance') NOT NULL DEFAULT 'disponible',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_avion),
    UNIQUE INDEX immatriculation_UNIQUE (immatriculation ASC),
    INDEX idx_modele (modele ASC),
    INDEX idx_statut (statut ASC)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Flotte d\'avions avec leurs spécifications';

-- ============================================
-- TABLE: vols (Vols)
-- ============================================
CREATE TABLE vols (
    id_vol INT NOT NULL AUTO_INCREMENT,
    numero_vol VARCHAR(20) NOT NULL COMMENT 'Numéro de vol unique',
    id_avion INT NOT NULL,
    id_aeroport_depart INT NOT NULL,
    id_aeroport_arrivee INT NOT NULL,
    date_heure_depart DATETIME NOT NULL COMMENT 'Date et heure UTC de départ',
    date_heure_arrivee DATETIME NOT NULL COMMENT 'Date et heure UTC d\'arrivée',
    prix DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Prix du vol',
    statut ENUM('programme', 'embarquement', 'decolle', 'arrive', 'annule') NOT NULL DEFAULT 'programme',
    places_disponibles INT NOT NULL COMMENT 'Places disponibles (calculé automatiquement)',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_vol),
    UNIQUE INDEX numero_vol_UNIQUE (numero_vol ASC),
    INDEX idx_date_depart (date_heure_depart ASC),
    INDEX idx_aeroport_depart (id_aeroport_depart ASC),
    INDEX idx_aeroport_arrivee (id_aeroport_arrivee ASC),
    INDEX idx_statut (statut ASC),
    INDEX fk_vols_avion_idx (id_avion ASC),
    INDEX fk_vols_aeroport_depart_idx (id_aeroport_depart ASC),
    INDEX fk_vols_aeroport_arrivee_idx (id_aeroport_arrivee ASC),
    
    CONSTRAINT fk_vols_avion
        FOREIGN KEY (id_avion)
        REFERENCES avions (id_avion)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_vols_aeroport_depart
        FOREIGN KEY (id_aeroport_depart)
        REFERENCES aeroports (id_aeroport)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_vols_aeroport_arrivee
        FOREIGN KEY (id_aeroport_arrivee)
        REFERENCES aeroports (id_aeroport)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    
    -- Contraintes métier
    CONSTRAINT chk_aeroports_differents CHECK (id_aeroport_depart != id_aeroport_arrivee),
    CONSTRAINT chk_arrivee_apres_depart CHECK (date_heure_arrivee > date_heure_depart)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Vols programmés avec leurs détails';

-- ============================================
-- TABLE: reservations (Réservations)
-- ============================================
CREATE TABLE reservations (
    id_reservation INT NOT NULL AUTO_INCREMENT,
    token_reservation VARCHAR(255) NOT NULL COMMENT 'Token unique pour accès via email',
    id_vol INT NOT NULL,
    id_vol_retour INT NULL COMMENT 'Vol retour optionnel',
    email_client VARCHAR(255) NOT NULL,
    telephone_client VARCHAR(50) NULL,
    nombre_passagers INT NOT NULL,
    prix_total DECIMAL(10,2) NOT NULL,
    statut ENUM('confirmee', 'annulee', 'terminee') NOT NULL DEFAULT 'confirmee',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_reservation),
    UNIQUE INDEX token_reservation_UNIQUE (token_reservation ASC),
    INDEX idx_email_client (email_client ASC),
    INDEX idx_statut (statut ASC),
    INDEX fk_reservations_vol_idx (id_vol ASC),
    INDEX fk_reservations_vol_retour_idx (id_vol_retour ASC),
    
    CONSTRAINT fk_reservations_vol
        FOREIGN KEY (id_vol)
        REFERENCES vols (id_vol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,
    CONSTRAINT fk_reservations_vol_retour
        FOREIGN KEY (id_vol_retour)
        REFERENCES vols (id_vol)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Réservations clients avec tokens d\'accès';

-- ============================================
-- TABLE: passagers (Passagers)
-- ============================================
CREATE TABLE passagers (
    id_passager INT NOT NULL AUTO_INCREMENT,
    id_reservation INT NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    nom VARCHAR(255) NOT NULL,
    numero_siege VARCHAR(10) NULL COMMENT 'Numéro de siège (ex: 12A, 15F)',
    type_passager ENUM('adulte', 'enfant', 'bebe') NOT NULL DEFAULT 'adulte',
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_modification TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_passager),
    INDEX idx_nom (nom ASC, prenom ASC),
    INDEX idx_numero_siege (numero_siege ASC),
    INDEX fk_passagers_reservation_idx (id_reservation ASC),
    
    CONSTRAINT fk_passagers_reservation
        FOREIGN KEY (id_reservation)
        REFERENCES reservations (id_reservation)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    
    -- Un siège ne peut être attribué qu'une seule fois par vol
    UNIQUE INDEX unique_siege_par_vol (id_reservation ASC, numero_siege ASC)
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Détails des passagers par réservation';

-- ============================================
-- TABLE: historique_vols (Historique des vols)
-- ============================================
CREATE TABLE historique_vols (
    id_historique INT NOT NULL AUTO_INCREMENT,
    id_vol INT NOT NULL,
    action ENUM('programme', 'embarquement', 'decollage', 'atterrissage', 'annule') NOT NULL,
    date_heure_action DATETIME NOT NULL,
    notes TEXT NULL,
    id_utilisateur INT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_historique),
    INDEX idx_action (action ASC),
    INDEX idx_date_action (date_heure_action ASC),
    INDEX fk_historique_vol_idx (id_vol ASC),
    INDEX fk_historique_utilisateur_idx (id_utilisateur ASC),
    
    CONSTRAINT fk_historique_vol
        FOREIGN KEY (id_vol)
        REFERENCES vols (id_vol)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_historique_utilisateur
        FOREIGN KEY (id_utilisateur)
        REFERENCES utilisateurs (id_utilisateur)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Historique des actions sur les vols';

-- ============================================
-- TABLE: historique_emails (Historique des emails)
-- ============================================
CREATE TABLE historique_emails (
    id_email INT NOT NULL AUTO_INCREMENT,
    id_reservation INT NOT NULL,
    type_email ENUM('confirmation', 'carte_embarquement', 'annulation', 'modification') NOT NULL,
    email_destinataire VARCHAR(255) NOT NULL,
    sujet VARCHAR(500) NULL,
    date_envoi DATETIME NOT NULL,
    statut ENUM('envoye', 'echec', 'en_attente') NOT NULL DEFAULT 'en_attente',
    message_erreur TEXT NULL,
    date_creation TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id_email),
    INDEX idx_type_email (type_email ASC),
    INDEX idx_date_envoi (date_envoi ASC),
    INDEX idx_statut (statut ASC),
    INDEX fk_emails_reservation_idx (id_reservation ASC),
    
    CONSTRAINT fk_emails_reservation
        FOREIGN KEY (id_reservation)
        REFERENCES reservations (id_reservation)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE = InnoDB
  DEFAULT CHARACTER SET = utf8mb4
  COLLATE = utf8mb4_unicode_ci
  COMMENT = 'Historique des emails envoyés';

-- ============================================
-- DONNÉES DE TEST
-- ============================================

-- Utilisateur administrateur par défaut
INSERT INTO utilisateurs (email, mot_de_passe, nom) VALUES 
('admin@flyingweb.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrateur');

-- Aéroports de test
INSERT INTO aeroports (code_iata, nom, ville, pays, longueur_piste_max) VALUES 
('CDG', 'Charles de Gaulle', 'Paris', 'France', 4200.00),
('ORY', 'Orly', 'Paris', 'France', 3650.00),
('LHR', 'Heathrow', 'Londres', 'Royaume-Uni', 3902.00),
('JFK', 'John F. Kennedy', 'New York', 'États-Unis', 4423.00),
('LAX', 'Los Angeles International', 'Los Angeles', 'États-Unis', 3685.00),
('NRT', 'Narita International', 'Tokyo', 'Japon', 4000.00),
('BCN', 'Barcelona-El Prat', 'Barcelone', 'Espagne', 3500.00),
('FCO', 'Leonardo da Vinci', 'Rome', 'Italie', 3900.00);

-- Avions de test
INSERT INTO avions (modele, immatriculation, capacite_passagers, longueur, statut) VALUES 
('Airbus A320', 'F-GKXA', 180, 37.57, 'disponible'),
('Airbus A321', 'F-GKXB', 220, 44.51, 'disponible'),
('Boeing 737-800', 'F-GKXC', 189, 32.18, 'disponible'),
('Boeing 747-400', 'F-GKXD', 416, 70.66, 'disponible'),
('Airbus A350', 'F-GKXE', 350, 66.80, 'disponible'),
('Boeing 777-300', 'F-GKXF', 396, 73.90, 'maintenance');

-- ============================================
-- VUES UTILES
-- ============================================

-- Vue pour les vols avec informations complètes
CREATE VIEW vue_details_vols AS
SELECT 
    v.id_vol,
    v.numero_vol,
    v.date_heure_depart,
    v.date_heure_arrivee,
    v.prix,
    v.statut,
    v.places_disponibles,
    a.modele as modele_avion,
    a.immatriculation as id_avion,
    dep.code_iata as code_depart,
    dep.nom as nom_aeroport_depart,
    dep.ville as ville_depart,
    arr.code_iata as code_arrivee,
    arr.nom as nom_aeroport_arrivee,
    arr.ville as ville_arrivee,
    TIMESTAMPDIFF(MINUTE, v.date_heure_depart, v.date_heure_arrivee) as duree_minutes
FROM vols v
JOIN avions a ON v.id_avion = a.id_avion
JOIN aeroports dep ON v.id_aeroport_depart = dep.id_aeroport
JOIN aeroports arr ON v.id_aeroport_arrivee = arr.id_aeroport;

-- Vue pour les réservations avec détails des vols
CREATE VIEW vue_details_reservations AS
SELECT 
    r.id_reservation,
    r.token_reservation,
    r.email_client,
    r.nombre_passagers,
    r.prix_total,
    r.statut,
    r.date_creation,
    v.numero_vol,
    v.date_heure_depart,
    v.date_heure_arrivee,
    dep.ville as ville_depart,
    arr.ville as ville_arrivee,
    vr.numero_vol as numero_vol_retour,
    vr.date_heure_depart as date_heure_depart_retour
FROM reservations r
JOIN vols v ON r.id_vol = v.id_vol
JOIN aeroports dep ON v.id_aeroport_depart = dep.id_aeroport
JOIN aeroports arr ON v.id_aeroport_arrivee = arr.id_aeroport
LEFT JOIN vols vr ON r.id_vol_retour = vr.id_vol;

-- ============================================
-- TRIGGERS POUR LA GESTION AUTOMATIQUE
-- ============================================

-- Trigger pour mettre à jour les sièges disponibles après insertion de réservation
DELIMITER //
CREATE TRIGGER maj_places_apres_reservation
    AFTER INSERT ON reservations
    FOR EACH ROW
BEGIN
    UPDATE vols 
    SET places_disponibles = places_disponibles - NEW.nombre_passagers 
    WHERE id_vol = NEW.id_vol;
    
    IF NEW.id_vol_retour IS NOT NULL THEN
        UPDATE vols 
        SET places_disponibles = places_disponibles - NEW.nombre_passagers 
        WHERE id_vol = NEW.id_vol_retour;
    END IF;
END //

-- Trigger pour restaurer les sièges disponibles après annulation de réservation
CREATE TRIGGER restaurer_places_apres_annulation
    AFTER UPDATE ON reservations
    FOR EACH ROW
BEGIN
    IF OLD.statut != 'annulee' AND NEW.statut = 'annulee' THEN
        UPDATE vols 
        SET places_disponibles = places_disponibles + NEW.nombre_passagers 
        WHERE id_vol = NEW.id_vol;
        
        IF NEW.id_vol_retour IS NOT NULL THEN
            UPDATE vols 
            SET places_disponibles = places_disponibles + NEW.nombre_passagers 
            WHERE id_vol = NEW.id_vol_retour;
        END IF;
    END IF;
END //

-- Trigger pour initialiser les sièges disponibles lors de la création d'un vol
CREATE TRIGGER init_places_creation_vol
    AFTER INSERT ON vols
    FOR EACH ROW
BEGIN
    UPDATE vols v
    JOIN avions a ON v.id_avion = a.id_avion
    SET v.places_disponibles = a.capacite_passagers
    WHERE v.id_vol = NEW.id_vol;
END //

DELIMITER ;

-- ============================================
-- INDEX ADDITIONNELS POUR PERFORMANCES
-- ============================================

-- Index composites pour les recherches fréquentes
CREATE INDEX idx_recherche_vols ON vols (id_aeroport_depart, id_aeroport_arrivee, date_heure_depart, statut);
CREATE INDEX idx_client_reservations ON reservations (email_client, statut);
CREATE INDEX idx_nom_passagers ON passagers (nom, prenom);

-- ============================================
-- FINALISATION
-- ============================================

-- Activation des contraintes de clés étrangères
SET FOREIGN_KEY_CHECKS = 1;

-- Message de confirmation
SELECT 'Base de données Flying WEB créée avec succès !' as Message;
