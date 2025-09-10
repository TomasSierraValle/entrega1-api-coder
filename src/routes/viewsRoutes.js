const { Router } = require('express');
const { getAllProducts, getAll } = require('../services/productService'); // usa tu servicio actual

const router = Router();

router.get('/', async (_req, res) => {
  const products = await getAll();
  res.render('home', { title: 'Home', products });
});

router.get('/realtimeproducts', async (_req, res) => {
  const products = await getAll();
  res.render('realTimeProducts', { title: 'RealTime', products });
});

module.exports = router;
