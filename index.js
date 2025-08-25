const app = require('./app');              // importamos la app ya configurada
const { port } = require('./src/config/config');
const { ensureDataFiles } = require('./src/db'); // opcional: crea data/products.json y carts.json si no existen

(async () => {
  try {
    if (typeof ensureDataFiles === 'function') {
      await ensureDataFiles();             // asegura que existan los archivos de persistencia
    }

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1);
  }
})();
