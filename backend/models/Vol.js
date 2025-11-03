const mongoose = require('mongoose');

const volSchema = new mongoose.Schema({
  numero_vol: { type: String, required: true, unique: true },
  aeroport_depart_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Aeroport', required: true },
  aeroport_arrivee_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Aeroport', required: true },
  avion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Avion', required: true },
  date_depart_utc: { type: Date, required: true },
  date_arrivee_utc: { type: Date, required: true },
  statut: { type: String, enum: ['planifie', 'en_vol', 'atterri', 'annule', 'retard'], default: 'planifie' }
});

module.exports = mongoose.model('Vol', volSchema);
