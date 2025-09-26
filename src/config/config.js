// src/config/config.js
require('dotenv').config();
const path = require('path');

const ROOT_DIR = process.cwd();
const DATA_DIR = process.env.DATA_DIR || 'data';

module.exports = {
  port: Number(process.env.PORT) || 8080,

  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/coder_entrega_final',

  // rutas a archivos (ya no usadas en Mongo, pero quedan para compatibilidad)
  paths: {
    root: ROOT_DIR,
    dataDir: path.join(ROOT_DIR, DATA_DIR),
    products: path.join(ROOT_DIR, DATA_DIR, process.env.PRODUCTS_FILE || 'products.json'),
    carts: path.join(ROOT_DIR, DATA_DIR, process.env.CARTS_FILE || 'carts.json'),
  }
};
