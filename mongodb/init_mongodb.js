use flying_web;

db.createCollection("users", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "password"],
      properties: {
        email: { bsonType: "string" },
        password: { bsonType: "string" }
      }
    }
  }
});


db.createCollection("avions", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["modele", "identification", "nombre_places", "dimension"],
      properties: {
        modele: { bsonType: "string" },
        identification: { bsonType: "string" },
        nombre_places: { bsonType: "int" },
        dimension: { bsonType: "double" }
      }
    }
  }
});


db.createCollection("aeroports", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["ville", "longueur_max"],
      properties: {
        ville: { bsonType: "string" },
        longueur_max: { bsonType: "double" }
      }
    }
  }
});


db.createCollection("vols", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["numero_vol", "aeroport_depart_id", "aeroport_arrivee_id", "avion_id", "date_depart_utc", "date_arrivee_utc"],
      properties: {
        numero_vol: { bsonType: "string" },
        aeroport_depart_id: { bsonType: "objectId" },
        aeroport_arrivee_id: { bsonType: "objectId" },
        avion_id: { bsonType: "objectId" },
        date_depart_utc: { bsonType: "date" },
        date_arrivee_utc: { bsonType: "date" },
        statut: { enum: ["planifie", "en_vol", "atterri", "annule", "retard"] }
      }
    }
  }
});


db.createCollection("reservations", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["vol_id", "token", "nombre_passagers", "email_contact"],
      properties: {
        vol_id: { bsonType: "objectId" },
        token: { bsonType: "string" },
        nombre_passagers: { bsonType: "int" },
        email_contact: { bsonType: "string" },
        statut: { enum: ["active", "annulee"] }
      }
    }
  }
});


db.createCollection("passagers", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["reservation_id", "nom", "prenom"],
      properties: {
        reservation_id: { bsonType: "objectId" },
        nom: { bsonType: "string" },
        prenom: { bsonType: "string" },
        numero_siege: { bsonType: "string" }
      }
    }
  }
});


db.users.createIndex({ email: 1 }, { unique: true });
db.avions.createIndex({ identification: 1 }, { unique: true });
db.vols.createIndex({ numero_vol: 1 }, { unique: true });
db.reservations.createIndex({ token: 1 }, { unique: true });

print("Collections créées avec succès !");
