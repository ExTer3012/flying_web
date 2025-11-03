const express = require('express');
const router = express.Router();
const Vol = require('../models/Vol');
const Avion = require('../models/Avion');
const Aeroport = require('../models/Aeroport');
const auth = require('../middleware/auth');

// GET (avec populate pour avoir les détails)
router.get('/', async (req, res) => {
  try {
    const vols = await Vol.find()
      .populate('aeroport_depart_id')
      .populate('aeroport_arrivee_id')
      .populate('avion_id');
    res.json(vols);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// GET (pour le frontend)
router.get('/recherche', async (req, res) => {
  try {
    const { ville_depart, ville_arrivee, date } = req.query;
    
    let query = { statut: { $ne: 'annule' } };
    
    // Recherche par ville de départ
    if (ville_depart) {
      const aeroportDepart = await Aeroport.findOne({ ville: new RegExp(ville_depart, 'i') });
      if (aeroportDepart) query.aeroport_depart_id = aeroportDepart._id;
    }
    
    // Recherche par ville d'arrivée
    if (ville_arrivee) {
      const aeroportArrivee = await Aeroport.findOne({ ville: new RegExp(ville_arrivee, 'i') });
      if (aeroportArrivee) query.aeroport_arrivee_id = aeroportArrivee._id;
    }
    
    // Recherche par date (avec tolérance de 3 jours)
    if (date) {
      const searchDate = new Date(date);
      const dateMin = new Date(searchDate);
      dateMin.setDate(dateMin.getDate() - 3);
      const dateMax = new Date(searchDate);
      dateMax.setDate(dateMax.getDate() + 3);
      query.date_depart_utc = { $gte: dateMin, $lte: dateMax };
    }
    
    const vols = await Vol.find(query)
      .populate('aeroport_depart_id')
      .populate('aeroport_arrivee_id')
      .populate('avion_id');
      
    res.json(vols);
  } catch (error) {
    res.status(500).json({ message: 'Erreur recherche', error: error.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const vol = await Vol.findById(req.params.id)
      .populate('aeroport_depart_id')
      .populate('aeroport_arrivee_id')
      .populate('avion_id');
    if (!vol) return res.status(404).json({ message: 'Vol non trouvé' });
    res.json(vol);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST (protégé)
router.post('/', auth, async (req, res) => {
  try {
    // Vérifier que l'avion n'est pas déjà en vol
    const avion = await Avion.findById(req.body.avion_id);
    if (!avion) return res.status(404).json({ message: 'Avion non trouvé' });
    
    // Vérifier que l'avion n'est pas trop grand pour l'aéroport
    const aeroportArrivee = await Aeroport.findById(req.body.aeroport_arrivee_id);
    if (avion.dimension > aeroportArrivee.longueur_max) {
      return res.status(400).json({ 
        message: 'Avion trop grand pour cet aéroport',
        avion_dimension: avion.dimension,
        aeroport_longueur_max: aeroportArrivee.longueur_max
      });
    }
    
    const vol = new Vol(req.body);
    await vol.save();
    res.status(201).json(vol);
  } catch (error) {
    res.status(400).json({ message: 'Erreur création', error: error.message });
  }
});

// PUT modifier un vol (protégé)
router.put('/:id', auth, async (req, res) => {
  try {
    const vol = await Vol.findById(req.params.id);
    if (!vol) return res.status(404).json({ message: 'Vol non trouvé' });
    
    // Vérifier si le vol n'a pas déjà décollé
    if (vol.statut === 'en_vol' || vol.statut === 'atterri') {
      return res.status(400).json({ message: 'Impossible de modifier un vol déjà décollé' });
    }
    
    const volUpdated = await Vol.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(volUpdated);
  } catch (error) {
    res.status(400).json({ message: 'Erreur modification', error: error.message });
  }
});

// PUT faire décoller un avion (protégé)
router.put('/:id/decoller', auth, async (req, res) => {
  try {
    const vol = await Vol.findById(req.params.id);
    if (!vol) return res.status(404).json({ message: 'Vol non trouvé' });
    
    if (vol.statut !== 'planifie') {
      return res.status(400).json({ message: 'Le vol doit être planifié pour décoller' });
    }
    
    vol.statut = 'en_vol';
    await vol.save();
    res.json({ message: 'Avion décollé', vol });
  } catch (error) {
    res.status(400).json({ message: 'Erreur décollage', error: error.message });
  }
});

// PUT faire atterrir un avion (protégé)
router.put('/:id/atterrir', auth, async (req, res) => {
  try {
    const vol = await Vol.findById(req.params.id);
    if (!vol) return res.status(404).json({ message: 'Vol non trouvé' });
    
    if (vol.statut !== 'en_vol') {
      return res.status(400).json({ message: 'L\'avion doit être en vol pour atterrir' });
    }
    
    vol.statut = 'atterri';
    await vol.save();
    res.json({ message: 'Avion atterri', vol });
  } catch (error) {
    res.status(400).json({ message: 'Erreur atterrissage', error: error.message });
  }
});

// DELETE (protégé)
router.delete('/:id', auth, async (req, res) => {
  try {
    const vol = await Vol.findById(req.params.id);
    if (!vol) return res.status(404).json({ message: 'Vol non trouvé' });
    
    vol.statut = 'annule';
    await vol.save();
    res.json({ message: 'Vol annulé', vol });
  } catch (error) {
    res.status(500).json({ message: 'Erreur annulation', error: error.message });
  }
});

module.exports = router;
