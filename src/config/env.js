// src/config/env.js
require('dotenv').config();

module.exports = {
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/coder_entrega_final',
  // opcional: conservás legacy por compatibilidad
  dataDir: process.env.DATA_DIR || 'data',
  productsFile: process.env.PRODUCTS_FILE || 'products.json',
  cartsFile: process.env.CARTS_FILE || 'carts.json',
};
