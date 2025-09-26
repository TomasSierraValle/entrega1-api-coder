const { Router } = require('express');
const ctrl = require('../controllers/productController');
const router = Router();

router.get('/', ctrl.getProducts);
router.get('/:pid', ctrl.getProductById);

module.exports = router;
