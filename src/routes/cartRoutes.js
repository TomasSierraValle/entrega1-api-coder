const { Router } = require('express');
const ctrl = require('../controllers/cartController');

const router = Router();

// Crear carrito
// POST /api/carts
router.post('/', ctrl.create);

// Listar productos de un carrito
// GET /api/carts/:cid
router.get('/:cid', ctrl.getProducts);

// Agregar producto (o incrementar cantidad) en un carrito
// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', ctrl.addProduct);

module.exports = router;
