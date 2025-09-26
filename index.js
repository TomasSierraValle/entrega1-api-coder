// index.js
const { httpServer } = require('./app');
const { port, mongoUri } = require('./src/config/env');
const { connectMongo } = require('./src/db/mongo');

(async () => {
  try {
    await connectMongo(mongoUri); // conecta a Mongo usando la URI de env.js
    //console.log(`MongoDB conectado: ${maskUri(mongoUri)}`);
    console.log('MongoDB conectado');


    httpServer.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });

    // Manejo elegante de señales (opcional)
    process.on('SIGINT', async () => {
      console.log('\nCerrando servidor y conexión Mongo...');
      try {
        const mongoose = require('mongoose');
        await mongoose.connection.close();
      } finally {
        httpServer.close(() => process.exit(0));
      }
    });
  } catch (err) {
    console.error('Error al iniciar la aplicación:', err);
    process.exit(1);
  }
})();
