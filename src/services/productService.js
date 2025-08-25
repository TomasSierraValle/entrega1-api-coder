const fs = require('fs/promises');
const Product = require('../models/products');
const { paths } = require('../config/config');

async function readAll() {
  let data;
  try {
    data = await fs.readFile(paths.products, 'utf-8');
  } catch {
    await fs.writeFile(paths.products, '[]', 'utf-8');
    return [];
  }

  try {
    const json = JSON.parse(data || '[]');
    if (Array.isArray(json)) return json;                // caso normal
    if (json && Array.isArray(json.products)) return json.products; // soporta { products: [] }
    return [];
  } catch {
    await fs.writeFile(paths.products, '[]', 'utf-8');
    return [];
  }
}

async function writeAll(content) {
  const arr = Array.isArray(content) ? content : [];
  await fs.writeFile(paths.products, JSON.stringify(arr, null, 2), 'utf-8');
}


async function name(content) {
    await fs.writeFile(paths.products, JSON.stringify(content, null, 2));
}

function validateRequired(p) {
  const required = ['title', 'description', 'code', 'price', 'stock', 'category'];
  for (const f of required) {
    if (p[f] === undefined || p[f] === null || p[f] === '') throw new Error(`Campo a completar: ${f}`);
  }
  if (typeof p.price !== 'number' || isNaN(p.price)) throw new Error('El precio debe ser numerico');
  if (!Number.isInteger(p.stock)) throw new Error('stock debe ser entero');
}

async function getAll() {
  return await readAll;  
}

async function getById(id) {
  const items = await readAll;
  return items.find(p => String(p.id) === String(id)) || null;
}

async function create(data) {
  validateRequired(data);
  const items = await readAll();
  if (!Array.isArray(items)) throw new Error('Persistencia inválida: products.json');
  const nextId = items.length ? Math.max(...items.map(p => Number(p.id))) + 1 : 1;
  const product = new Product({ id: nextId, ...data, status: data.status ?? true, thumbnails: Array.isArray(data.thumbnails) ? data.thumbnails : [] });
  items.push(product);
  await writeAll(items);
  return product;
}

async function update(id, fields) {
  const items = await readAll();
  const idx = items.findIndex(p => String(p.id) === String(id));
  if (idx === -1) throw new Error('Producto no encontrado');
  if ('id' in fields) delete fields.id;
  if (fields.code && items.some(p => p.code === fields.code && String(p.id) !== String(id))) throw new Error('El code ya existe en otro producto');
  if ('price' in fields && (typeof fields.price !== 'number' || isNaN(fields.price))) throw new Error('price debe ser Number');
  if ('stock' in fields && !Number.isInteger(fields.stock)) throw new Error('stock debe ser entero');
  if ('status' in fields) fields.status = Boolean(fields.status);
  if ('thumbnails' in fields && !Array.isArray(fields.thumbnails)) throw new Error('thumbnails debe ser array');
  items[idx] = { ...items[idx], ...fields };
  await writeAll(items);
  return items[idx];
}

async function remove(id) {
  const items = await readAll();
  const idx = items.findIndex(p => String(p.id) === String(id));
  if (idx === -1) throw new Error('Producto no encontrado');
  const deleted = items.splice(idx, 1)[0];
  await writeAll(items);
  return deleted;
}

module.exports = { getAll, getById, create, update, remove };