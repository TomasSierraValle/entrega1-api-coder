const express = require('express');
const Product = require('../models/products');
const Cart = require('../models/carrito');
const mongoose = require('mongoose');


const router = express.Router();

// Listado con paginación
router.get('/products', async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  const filter = {};
  if (query) {
    const s = String(query).trim();

    if (s.startsWith('category:')) {
      filter.category = s.split('category:')[1];
    } else if (s.startsWith('status:')) {
      // status:true → filtra productos con status = true
      filter.status = s.split('status:')[1] === 'true';
    } else if (s.startsWith('available:')) {
      // available:true → filtra productos con stock > 0
      filter.stock = { $gt: 0 };
    } else {
      // Si no matchea, lo interpretamos como categoría
      filter.category = s;
    }
  }

  const options = {
    limit: parseInt(limit),
    page: parseInt(page),
    sort: sort ? { price: sort === 'asc' ? 1 : -1 } : undefined,
    lean: true
  };

  const result = await Product.paginate(filter, options);

  res.render('products', {
    title: 'Listado de productos',
    products: result.docs,
    page: result.page,
    totalPages: result.totalPages,
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}&sort=${sort||''}&query=${query||''}` : null,
    nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}&sort=${sort||''}&query=${query||''}` : null,
    query,
    sortAsc: sort === 'asc',
    sortDesc: sort === 'desc',
    limit5: limit == 5,
    limit10: limit == 10,
    limit20: limit == 20,
  });
});

// Detalle
router.get('/products/:pid', async (req, res) => {
  const product = await Product.findById(req.params.pid).lean();
  if (!product) return res.status(404).send('Producto no encontrado');
  res.render('product-detail', { title: product.title, product });
});

// Carrito
router.get('/carts/:cid', async (req, res) => {
  const { cid } = req.params;

  // 👇 Validación: si el id no es un ObjectId válido, cortamos acá
  if (!mongoose.Types.ObjectId.isValid(cid)) {
    return res.status(400).send('ID inválido');
  }

  const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
  if (!cart) return res.status(404).send('Carrito no encontrado');

  const products = cart.products.map(p => ({
    product: p.product,
    quantity: p.quantity,
    subtotal: p.product.price * p.quantity
  }));

  const total = products.reduce((acc, p) => acc + p.subtotal, 0);

  res.render('cart', {
    title: 'Carrito',
    cart: { _id: cart._id, products, total }
  });
});

/*
router.get('/carts', (req, res) => {
  const { cid } = req.query;
  if (cid) return res.redirect(`/carts/${cid}`);
  return res.status(400).send('Falta cartId. Usá /carts/:cid o /carts?cid=<id>');
});*/

module.exports = router;
