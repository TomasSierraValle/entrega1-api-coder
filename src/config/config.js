
// Lee variables desde .env
require('dotenv').config();
const path = require('path');

const ROOT_DIR = process.cwd();
const DATA_DIR = process.env.DATA_DIR || 'data';

module.exports = {
  port: Number(process.env.PORT) || 8080,

  paths: {
    root: ROOT_DIR,
    dataDir: path.join(ROOT_DIR, DATA_DIR),
    products: path.join(ROOT_DIR, DATA_DIR, process.env.PRODUCTS_FILE || 'products.json'),
    carts: path.join(ROOT_DIR, DATA_DIR, process.env.CARTS_FILE || 'carts.json'),
  }
};
