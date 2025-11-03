const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur MongoDB:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/avions', require('./routes/avions'));
app.use('/api/aeroports', require('./routes/aeroports'));
app.use('/api/vols', require('./routes/vols'));
app.use('/api/reservations', require('./routes/reservations'));

// Route test
app.get('/', (req, res) => {
  res.json({ message: 'API Flying Web - active' });
});

// Démarrage serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
