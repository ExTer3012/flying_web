const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  vol_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vol', required: true },
  token: { type: String, required: true, unique: true },
  nombre_passagers: { type: Number, required: true },
  email_contact: { type: String, required: true },
  statut: { type: String, enum: ['active', 'annulee'], default: 'active' }
});

module.exports = mongoose.model('Reservation', reservationSchema);
