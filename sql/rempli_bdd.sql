-- admin (mdp: admin123)
INSERT INTO users (email, password) VALUES 
('admin@flyingweb.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

INSERT INTO avions (modele, identification, nombre_places, dimension) VALUES
('A320', 'F-HBNA', 180, 37.57),
('B747', 'F-GTUI', 400, 70.66),
('A315', 'F-GUAA', 100, 31.45);

INSERT INTO aeroports (ville, longueur_max) VALUES
('Paris', 75.00),
('New York', 80.00),
('Londres', 75.00),
('Tokyo', 70.00),
('Nice', 40.00);

INSERT INTO vols (numero_vol, aeroport_depart_id, aeroport_arrivee_id, avion_id, date_depart_utc, date_arrivee_utc) VALUES
('FW001', 1, 2, 1, '2025-10-20 10:00:00', '2025-10-20 18:00:00'),
('FW002', 2, 1, 1, '2025-10-22 14:00:00', '2025-10-22 22:00:00'),
('FW003', 1, 3, 3, '2025-10-21 08:00:00', '2025-10-21 09:30:00');