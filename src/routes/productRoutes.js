const { Router } = require('express');
const ctrl = require('../controllers/productController');

const router = Router();

// Listar todos los productos
router.get('/', ctrl.list);

// Obtener un producto por id
router.get('/:pid', ctrl.get);

// Crear producto
router.post('/', ctrl.create);

// Actualizar producto (sin tocar id)
router.put('/:pid', ctrl.update);

// Eliminar producto
router.delete('/:pid', ctrl.remove);

module.exports = router;
