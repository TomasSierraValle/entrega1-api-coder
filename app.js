const path = require('path');
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const exphbs = require('express-handlebars');

const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const viewsRouter = require('./src/routes/viewsRoutes');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
app.set('io', io);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));

// 👉 Configuración de Handlebars SIN helpers custom
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'src', 'views'));

// APIs
app.use('/api/products', productRoutes);
app.use('/api/carts', cartRoutes);

// Vistas
app.use('/', viewsRouter);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Ruta no válida' }));

// 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Socket.io
io.on('connection', socket => {
  console.log('Cliente conectado:', socket.id);
});

module.exports = { app, httpServer };
