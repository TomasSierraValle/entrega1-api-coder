const Cart = require('../models/carrito');  
const Product = require('../models/products');


exports.createCart = async (_req, res) => {
  try {
    // Crea carrito vacío
    const cart = await Cart.create({ products: [] });
    res.status(201).json({ status: 'success', payload: cart });
  } catch (err) {
    console.error('createCart error:', err);
    res.status(500).json({ status: 'error', error: 'Cannot create cart' });
  }
};

exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
    if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
    res.json({ status: 'success', payload: cart });
  } catch {
    res.status(400).json({ status: 'error', error: 'Invalid id' });
  }
};

exports.addProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const qty = Math.max(parseInt(req.body?.quantity ?? 1, 10), 1);

  const prod = await Product.findById(pid);
  if (!prod) return res.status(404).json({ status: 'error', error: 'Product not found' });

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  const idx = cart.products.findIndex(p => String(p.product) === String(pid));
  if (idx === -1) cart.products.push({ product: pid, quantity: qty });
  else cart.products[idx].quantity += qty;

  await cart.save();
  res.json({ status: 'success', payload: cart });
};

exports.removeProduct = async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
  cart.products = cart.products.filter(p => String(p.product) !== String(pid));
  await cart.save();
  res.json({ status: 'success', payload: cart });
};

exports.replaceAllProducts = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;

  if (!Array.isArray(products))
    return res.status(400).json({ status: 'error', error: 'products must be an array' });

  for (const it of products) {
    if (!it.product) return res.status(400).json({ status: 'error', error: 'product is required' });
    if (!Number.isFinite(it.quantity) || it.quantity < 1)
      return res.status(400).json({ status: 'error', error: 'quantity must be >= 1' });
  }

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  cart.products = products.map(i => ({ product: i.product, quantity: i.quantity }));
  await cart.save();
  res.json({ status: 'success', payload: cart });
};

exports.setProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const qty = parseInt(req.body?.quantity, 10);
  if (!Number.isFinite(qty) || qty < 1)
    return res.status(400).json({ status: 'error', error: 'quantity must be >= 1' });

  const cart = await Cart.findById(cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });

  const idx = cart.products.findIndex(p => String(p.product) === String(pid));
  if (idx === -1) return res.status(404).json({ status: 'error', error: 'Product not in cart' });

  cart.products[idx].quantity = qty;
  await cart.save();
  res.json({ status: 'success', payload: cart });
};

exports.clearCart = async (req, res) => {
  const cart = await Cart.findById(req.params.cid);
  if (!cart) return res.status(404).json({ status: 'error', error: 'Cart not found' });
  cart.products = [];
  await cart.save();
  res.json({ status: 'success', payload: cart });
};
