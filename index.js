const { httpServer } = require('./app');     //importás el server
const { port } = require('./src/config/config');
const { ensureDataFiles } = require('./src/db');

(async () => {
  try {
    if (typeof ensureDataFiles === 'function') {
      await ensureDataFiles();
    }

    httpServer.listen(port, () => {          //escucha con el httpServer
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1);
  }
})();
