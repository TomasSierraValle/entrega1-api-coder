const express = require('express');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// APIs
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Ruta de prueba y health
app.get('/', (req, res) => res.send('Servidor funcionando 🚀'));
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404 para rutas no existentes
app.use((req, res) => res.status(404).json({ error: 'Ruta no valida' }));

// 500 error servidor
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app; // 👈 exportá la app, sin listen ni IIFE
