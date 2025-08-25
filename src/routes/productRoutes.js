const { Router } = require('express');
const ctrl = require('../controllers/productController');

const router = Router();

// Listar todos los productos
// GET /api/products
router.get('/', ctrl.list);

// Obtener un producto por id
// GET /api/products/:pid
router.get('/:pid', ctrl.get);

// Crear producto
// POST /api/products
router.post('/', ctrl.create);

// Actualizar producto (sin tocar id)
// PUT /api/products/:pid
router.put('/:pid', ctrl.update);

// Eliminar producto
// DELETE /api/products/:pid
router.delete('/:pid', ctrl.remove);

module.exports = router;
