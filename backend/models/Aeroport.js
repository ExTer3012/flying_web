const mongoose = require('mongoose');

const aeroportSchema = new mongoose.Schema({
  ville: { type: String, required: true },
  longueur_max: { type: Number, required: true }
});

module.exports = mongoose.model('Aeroport', aeroportSchema);
