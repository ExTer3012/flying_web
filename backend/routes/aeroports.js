const express = require('express');
const router = express.Router();
const Aeroport = require('../models/Aeroport');
const auth = require('../middleware/auth');

// GET (protégé)
router.get('/', auth, async (req, res) => {
  try {
    const aeroports = await Aeroport.find();
    res.json(aeroports);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET by ID (protégé)
router.get('/:id', auth, async (req, res) => {
  try {
    const aeroport = await Aeroport.findById(req.params.id);
    if (!aeroport) return res.status(404).json({ message: 'Aéroport non trouvé' });
    res.json(aeroport);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST (protégé)
router.post('/', auth, async (req, res) => {
  try {
    const aeroport = new Aeroport(req.body);
    await aeroport.save();
    res.status(201).json(aeroport);
  } catch (error) {
    res.status(400).json({ message: 'Erreur création', error: error.message });
  }
});

// PUT (protégé)
router.put('/:id', auth, async (req, res) => {
  try {
    const aeroport = await Aeroport.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!aeroport) return res.status(404).json({ message: 'Aéroport non trouvé' });
    res.json(aeroport);
  } catch (error) {
    res.status(400).json({ message: 'Erreur modification', error: error.message });
  }
});

// DELETE (protégé)
router.delete('/:id', auth, async (req, res) => {
  try {
    const aeroport = await Aeroport.findByIdAndDelete(req.params.id);
    if (!aeroport) return res.status(404).json({ message: 'Aéroport non trouvé' });
    res.json({ message: 'Aéroport supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur suppression', error: error.message });
  }
});

module.exports = router;
