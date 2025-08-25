// src/db/index.js
const fs = require('fs/promises');
const path = require('path');
const { paths } = require('../config/config');

// Crea los archivos de datos si no existen y garantiza que sean JSON válidos
async function ensureDataFiles() {
  const files = [
    { file: paths.products, initial: '[]' },
    { file: paths.carts, initial: '[]' },
  ];

  for (const { file, initial } of files) {
    try {
      await fs.access(file);
    } catch {
      await fs.mkdir(path.dirname(file), { recursive: true });
      await fs.writeFile(file, initial, 'utf-8');
    }

    // Lectura segura: si el archivo está vacío/corrupto, se rehace como []
    try {
      const content = await fs.readFile(file, 'utf-8');
      JSON.parse(content);
    } catch {
      await fs.writeFile(file, '[]', 'utf-8');
    }
  }
}

module.exports = { ensureDataFiles };
