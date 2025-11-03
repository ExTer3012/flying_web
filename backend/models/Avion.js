const mongoose = require('mongoose');

const avionSchema = new mongoose.Schema({
  modele: { type: String, required: true },
  identification: { type: String, required: true, unique: true },
  nombre_places: { type: Number, required: true },
  dimension: { type: Number, required: true }
});

module.exports = mongoose.model('Avion', avionSchema);
