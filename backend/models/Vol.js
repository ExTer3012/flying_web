const mongoose = require('mongoose');

const volSchema = new mongoose.Schema({
  numero_vol: { type: String, required: true, unique: true },
  aeroport_depart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Aeroport', required: true },
  aeroport_arrivee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Aeroport', required: true },
  avion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Avion', required: true },
  date_depart_utc: { type: Date, required: true },
  date_arrivee_utc: { type: Date, required: true },
  statut: { type: String, enum: ['planifie', 'en_vol', 'atterri', 'annule', 'retard'], default: 'planifie' },
  places_disponibles: { type: Number }
});

// Méthode pour mettre à jour le nombre de places disponibles
volSchema.methods.updatePlacesDisponibles = async function() {
  const Reservation = require('./Reservation');
  const Avion = require('./Avion');

  // Obtenir le nombre total de places de l'avion
  const avion = await Avion.findById(this.avion_id);
  const totalPlaces = avion.nombre_places;

  // Calculer le nombre de places réservées
  const reservations = await Reservation.find({ 
    vol_id: this._id,
    statut: 'active'
  });

  let placesReservees = 0;
  for (let res of reservations) {
    placesReservees += res.nombre_passagers;
  }

  // Mettre à jour les places disponibles
  this.places_disponibles = totalPlaces - placesReservees;
  await this.save();
  
  return this.places_disponibles;
};

module.exports = mongoose.model('Vol', volSchema);
