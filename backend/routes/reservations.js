const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Passager = require('../models/Passager');
const Vol = require('../models/Vol');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Configure mail
let transporter = null;
if (process.env.SMTP_HOST) {
  try {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });
  } catch (e) {
    console.warn('Impossible de configurer le transporteur mail:', e.message);
    transporter = null;
  }
} else {
  console.warn('SMTP non configuré (variables d\'environnement manquantes). Les emails ne seront pas envoyés.');
}

// GET réservation par token
router.get('/token/:token', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ token: req.params.token })
      .populate({
        path: 'vol_id',
        populate: [
          { path: 'aeroport_depart_id' },
          { path: 'aeroport_arrivee_id' },
          { path: 'avion_id' }
        ]
      });
      
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    
    const passagers = await Passager.find({ reservation_id: reservation._id });
    res.json({ reservation, passagers });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// POST
router.post('/', async (req, res) => {
  try {
    const { vol_id, nombre_passagers, email_contact, passagers } = req.body;
    
    // Vérifier que le vol existe
    const vol = await Vol.findById(vol_id).populate('avion_id');
    if (!vol) return res.status(404).json({ message: 'Vol non trouvé' });
    
    // Vérifier que le vol n'est pas annulé
    if (vol.statut === 'annule') {
      return res.status(400).json({ message: 'Vol annulé' });
    }
    
    // Vérifier qu'il reste des places
    const reservationsExistantes = await Reservation.find({ vol_id, statut: 'active' });
    let placesReservees = 0;
    for (let res of reservationsExistantes) {
      placesReservees += res.nombre_passagers;
    }
    
    if (placesReservees + nombre_passagers > vol.avion_id.nombre_places) {
      return res.status(400).json({ 
        message: 'Pas assez de places disponibles',
        places_restantes: vol.avion_id.nombre_places - placesReservees
      });
    }
    
    // Générer un token
    const token = crypto.randomBytes(32).toString('hex');
    
    // Créer la réservation
    const reservation = new Reservation({
      vol_id,
      token,
      nombre_passagers,
      email_contact
    });
    await reservation.save();
    
    // Créer les passagers
    const passagersCreated = [];
    for (let i = 0; i < passagers.length; i++) {
      const siege = `${Math.floor(placesReservees / 6) + 1 + Math.floor(i / 6)}${String.fromCharCode(65 + (placesReservees % 6) + (i % 6))}`;
      const passager = new Passager({
        reservation_id: reservation._id,
        nom: passagers[i].nom,
        prenom: passagers[i].prenom,
        numero_siege: siege
      });
      await passager.save();
      passagersCreated.push(passager);
    }
    // Tenter d'envoyer l'email de confirmation
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const lienAcces = `${frontendUrl}/ma-reservation/${token}`;

    if (transporter) {
      const mailOptions = {
        from: process.env.MAIL_FROM || 'no-reply@flyingweb.com',
        to: email_contact,
        subject: `Votre réservation Flying Web - ${vol.numero_vol}`,
        text: `Merci pour votre réservation. Consultez votre réservation ici: ${lienAcces}`,
        html: `<p>Merci pour votre réservation.</p>
               <p>Vous pouvez consulter, modifier ou annuler votre réservation en suivant ce lien :</p>
               <p><a href="${lienAcces}">${lienAcces}</a></p>`
      };

      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de réservation envoyé:', info.messageId);
      } catch (err) {
        console.error('Erreur envoi email réservation:', err && err.message ? err.message : err);
      }
    } else {
      console.log('Email non envoyé : transporter mail non configuré.');
    }

    res.status(201).json({ 
      message: 'Réservation créée',
      reservation, 
      passagers: passagersCreated,
      lien_acces: `/ma-reservation/${token}`
    });
  } catch (error) {
    res.status(400).json({ message: 'Erreur de création', error: error.message });
  }
});

// PUT 
router.put('/token/:token', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ token: req.params.token }).populate('vol_id');
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    
    // Vérifier que le vol n'a pas décollé
    if (reservation.vol_id.statut === 'en_vol' || reservation.vol_id.statut === 'atterri') {
      return res.status(400).json({ message: 'Impossible de modifier après le décollage' });
    }
    
    // Mettre à jour
    Object.assign(reservation, req.body);
    await reservation.save();
    res.json({ message: 'Réservation modifiée', reservation });
  } catch (error) {
    res.status(400).json({ message: 'Erreur de modification', error: error.message });
  }
});

// DELETE
router.delete('/token/:token', async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ token: req.params.token }).populate('vol_id');
    if (!reservation) return res.status(404).json({ message: 'Réservation non trouvée' });
    
    // Vérifier que le vol n'a pas décollé
    if (reservation.vol_id.statut === 'en_vol' || reservation.vol_id.statut === 'atterri') {
      return res.status(400).json({ message: 'Impossible d\'annuler après le décollage' });
    }
    
    reservation.statut = 'annulee';
    await reservation.save();
    res.json({ message: 'Réservation annulée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur d\'annulation', error: error.message });
  }
});

module.exports = router;
