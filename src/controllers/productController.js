const service = require('../services/productService'); // ajusta el path a tu servicio

// GET /api/products
exports.list = async (req, res, next) => {
  try {
    const products = await service.getAllProducts();
    res.json(products);
  } catch (err) { next(err); }
};

// GET /api/products/:pid
exports.get = async (req, res, next) => {
  try {
    const prod = await service.getById(req.params.pid);
    if (!prod) return res.status(404).json({ error: 'No encontrado' });
    res.json(prod);
  } catch (err) { next(err); }
};

// POST /api/products
exports.create = async (req, res, next) => {
  try {
    // casteos si vienen como string
    const price = Number(req.body.price);
    const stock = req.body.stock != null ? Number(req.body.stock) : 0;

    const payload = {
      title: req.body.title ?? '',
      description: req.body.description ?? '-',     // default
      code: req.body.code ?? `P-${Date.now()}`,     // default único
      price,
      stock: Number.isFinite(stock) ? stock : 0,
      category: req.body.category ?? 'general',     // default
      status: req.body.status ?? true,
      thumbnails: Array.isArray(req.body.thumbnails) ? req.body.thumbnails : []
    };

    const prod = await service.create(payload);
    const products = await service.getAll();

    const io = req.app.get('io');
    if (io) io.emit('products:updated', { action: 'create', product: prod, products });

    res.status(201).json(prod);
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:pid
exports.update = async (req, res, next) => {
  try {
    const updated = await service.updateProduct(req.params.pid, req.body);
    if (!updated) return res.status(404).json({ error: 'No encontrado' });

    // Opcional: volver a leer todo para enviar lista actualizada
    const products = await service.getAllProducts();
    req.app.get('io').emit('products:updated', {
      action: 'update',
      product: updated,
      products
    });

    res.json(updated);
  } catch (err) { next(err); }
};

// DELETE /api/products/:pid
exports.remove = async (req, res, next) => {
  try {
    const ok = await service.deleteProduct(req.params.pid);
    if (!ok) return res.status(404).json({ error: 'No encontrado' });

    const products = await service.getAllProducts();
    req.app.get('io').emit('products:updated', {
      action: 'delete',
      id: Number(req.params.pid),
      products
    });

    res.json({ ok: true });
  } catch (err) { next(err); }
};


//module.exports = { list, get, create, update, remove };
