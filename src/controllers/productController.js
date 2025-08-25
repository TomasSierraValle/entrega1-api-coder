const productService = require('../services/productService');

async function list(req, res) {
  try {
    const all = await productService.getAll();
    res.json(all);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function get(req, res) {
  try {
    const p = await productService.getById(req.params.pid);
    if (!p) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function create(req, res) {
  try {
    const created = await productService.create(req.body);
    res.status(201).json(created);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function update(req, res) {
  try {
    const up = await productService.update(req.params.pid, req.body);
    res.json(up);
  } catch (e) {
    res
      .status(e.message.includes('no encontrado') ? 404 : 400)
      .json({ error: e.message });
  }
}

async function remove(req, res) {
  try {
    const del = await productService.remove(req.params.pid);
    res.json({ message: 'Producto eliminado', deleted: del });
  } catch (e) {
    res
      .status(e.message.includes('no encontrado') ? 404 : 400)
      .json({ error: e.message });
  }
}

module.exports = { list, get, create, update, remove };
