const express = require('express');
const router = express.Router();
const Avion = require('../models/Avion');
const auth = require('../middleware/auth');

// GET (protégé)
router.get('/', auth, async (req, res) => {
  try {
    const avions = await Avion.find();
    res.json(avions);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET by ID (protégé)
router.get('/:id', auth, async (req, res) => {
  try {
    const avion = await Avion.findById(req.params.id);
    if (!avion) return res.status(404).json({ message: 'Avion non trouvé' });
    res.json(avion);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST (protégé)
router.post('/', auth, async (req, res) => {
  try {
    const avion = new Avion(req.body);
    await avion.save();
    res.status(201).json(avion);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
});

// PUT (protégé)
router.put('/:id', auth, async (req, res) => {
  try {
    const avion = await Avion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!avion) return res.status(404).json({ message: 'Avion non trouvé' });
    res.json(avion);
  } catch (error) {
    res.status(400).json({ message: 'Erreur de modification', error: error.message });
  }
});

// DELETE (protégé)
router.delete('/:id', auth, async (req, res) => {
  try {
    const avion = await Avion.findByIdAndDelete(req.params.id);
    if (!avion) return res.status(404).json({ message: 'Avion non trouvé' });
    res.json({ message: 'Avion supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur de suppression', error: error.message });
  }
});

module.exports = router;
