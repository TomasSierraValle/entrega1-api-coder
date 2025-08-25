const cartService = require('../services/cartService');

async function create(req, res) {
  try {
    const cart = await cartService.createCart();
    res.status(201).json(cart);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function getProducts(req, res) {
  try {
    const prods = await cartService.listProducts(req.params.cid);
    res.json(prods);
  } catch (e) {
    res
      .status(e.message.includes('no encontrado') ? 404 : 400)
      .json({ error: e.message });
  }
}

async function addProduct(req, res) {
  try {
    const quantity = req.body?.quantity ? Number(req.body.quantity) : 1;
    if (!Number.isInteger(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'quantity debe ser entero positivo' });
    }
    const cart = await cartService.addProduct(req.params.cid, req.params.pid, quantity);
    res.status(201).json(cart);
  } catch (e) {
    res
      .status(e.message.includes('no encontrado') ? 404 : 400)
      .json({ error: e.message });
  }
}

module.exports = { create, getProducts, addProduct };
