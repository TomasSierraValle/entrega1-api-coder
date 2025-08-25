const { Router } = require('express');
const ctrl = require('../controllers/cartController');

const router = Router();

// Crear carrito
router.post('/', ctrl.create);

// Listar productos de un carrito
router.get('/:cid', ctrl.getProducts);

// Agregar producto en un carrito
router.post('/:cid/product/:pid', ctrl.addProduct);

module.exports = router;
