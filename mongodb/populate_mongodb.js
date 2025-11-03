use flying_web;

db.users.insertOne({
  email: "admin@flyingweb.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMye4oKoEa3Ro9llC/.og/at2.uheWG/igi"
});

const avion1 = db.avions.insertOne({
  modele: "A320",
  identification: "F-HBNA",
  nombre_places: 180,
  dimension: 37.57
});

const avion2 = db.avions.insertOne({
  modele: "B747",
  identification: "F-GTUI",
  nombre_places: 400,
  dimension: 70.66
});

const avion3 = db.avions.insertOne({
  modele: "A315",
  identification: "F-GUAA",
  nombre_places: 100,
  dimension: 31.45
});


const aeroport1 = db.aeroports.insertOne({
  ville: "Paris",
  longueur_max: 75.5
});

const aeroport2 = db.aeroports.insertOne({
  ville: "New York",
  longueur_max: 80.5
});

const aeroport3 = db.aeroports.insertOne({
  ville: "Londres",
  longueur_max: 75.5
});

const aeroport4 = db.aeroports.insertOne({
  ville: "Tokyo",
  longueur_max: 70.5
});

const aeroport5 = db.aeroports.insertOne({
  ville: "Nice",
  longueur_max: 40.5
});


db.vols.insertMany([
  {
    numero_vol: "FW001",
    aeroport_depart_id: aeroport1.insertedId,
    aeroport_arrivee_id: aeroport2.insertedId,
    avion_id: avion1.insertedId,
    date_depart_utc: new Date("2025-10-20T10:00:00Z"),
    date_arrivee_utc: new Date("2025-10-20T18:00:00Z"),
    statut: "planifie"
  },
  {
    numero_vol: "FW002",
    aeroport_depart_id: aeroport2.insertedId,
    aeroport_arrivee_id: aeroport1.insertedId,
    avion_id: avion1.insertedId,
    date_depart_utc: new Date("2025-10-22T14:00:00Z"),
    date_arrivee_utc: new Date("2025-10-22T22:00:00Z"),
    statut: "planifie"
  },
  {
    numero_vol: "FW003",
    aeroport_depart_id: aeroport1.insertedId,
    aeroport_arrivee_id: aeroport3.insertedId,
    avion_id: avion3.insertedId,
    date_depart_utc: new Date("2025-10-21T08:00:00Z"),
    date_arrivee_utc: new Date("2025-10-21T09:30:00Z"),
    statut: "planifie"
  }
]);

print("Données insérées avec succès !");
print("Total users:", db.users.countDocuments());
print("Total avions:", db.avions.countDocuments());
print("Total aeroports:", db.aeroports.countDocuments());
print("Total vols:", db.vols.countDocuments());
