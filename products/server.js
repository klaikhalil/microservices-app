// Fichier: server.js
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/products_db';

// Connexion à MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware
app.use(express.json());

// Modèle de produit
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  stock: Number
});
const Product = mongoose.model('Product', productSchema);

// Routes
app.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Service de gestion des produits en écoute sur le port ${PORT}`);
});
