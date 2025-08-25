const fs = require('fs/promises');
const Cart = require('../models/carrito');
const { paths } = require('../config/config');

async function readAll() {
  const data = await fs.readFile(paths.carts, 'utf-8');
  return JSON.parse(data || '[]');
}
async function writeAll(content) {
  await fs.writeFile(paths.carts, JSON.stringify(content, null, 2));
}

async function getById(id) {
  const items = await readAll();
  return items.find(c => String(c.id) === String(id)) || null;
}

async function createCart() {
  const items = await readAll();
  const nextId = items.length ? Math.max(...items.map(c => Number(c.id))) + 1 : 1;
  const cart = new Cart({ id: nextId, products: [] });
  items.push(cart);
  await writeAll(items);
  return cart;
}

async function listProducts(cid) {
  const cart = await getById(cid);
  if (!cart) throw new Error('Carrito no encontrado');
  return cart.products;
}

async function addProduct(cid, pid, quantity = 1) {
  const items = await readAll();
  const idx = items.findIndex(c => String(c.id) === String(cid));
  if (idx === -1) throw new Error('Carrito no encontrado');

  const cart = items[idx];

  // validación mínima
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new Error('quantity debe ser entero positivo');
  }

  const found = cart.products.find(p => String(p.product) === String(pid));
  if (found) {
    found.quantity += quantity;
  } else {
    cart.products.push({ product: String(pid), quantity });
  }

  items[idx] = cart;
  await writeAll(items);
  return cart;
}

module.exports = { getById, createCart, listProducts, addProduct };
