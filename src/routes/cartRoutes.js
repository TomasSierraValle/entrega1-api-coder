const { Router } = require('express');
const c = require('../controllers/cartController');
const router = Router();

router.post('/', c.createCart);
router.get('/:cid', c.getCart);

router.post('/:cid/products/:pid', c.addProduct);
router.delete('/:cid/products/:pid', c.removeProduct);

router.put('/:cid', c.replaceAllProducts);
router.put('/:cid/products/:pid', c.setProductQuantity);

router.delete('/:cid', c.clearCart);

module.exports = router;
