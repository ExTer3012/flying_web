const mongoose = require('mongoose');

const passagerSchema = new mongoose.Schema({
  reservation_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  numero_siege: { type: String }
});

module.exports = mongoose.model('Passager', passagerSchema);
