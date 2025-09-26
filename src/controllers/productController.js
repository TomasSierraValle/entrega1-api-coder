const Product = require('../models/products');

const buildFilter = (q) => {
  if (!q) return {};
  const s = String(q).trim();
  if (s.startsWith('category:')) return { category: s.split('category:')[1] };
  if (s.startsWith('status:'))   return { status: s.split('status:')[1] === 'true' };
  if (s.startsWith('available:')) return { stock: { $gt: 0 } };
  return { category: s };
};

const buildSort = (sort) => {
  if (!sort) return null;
  if (String(sort).toLowerCase() === 'asc')  return { price: 1 };
  if (String(sort).toLowerCase() === 'desc') return { price: -1 };
  return null;
};

const buildLink = (req, page) => {
  if (!page) return null;
  const url = new URL(`${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`);
  const params = new URLSearchParams(req.query);
  params.set('page', page);
  url.search = params.toString();
  return url.toString();
};

exports.getProducts = async (req, res) => {
  try {
    const limit = Math.max(parseInt(req.query.limit ?? '10', 10), 1);
    const page  = Math.max(parseInt(req.query.page  ?? '1', 10), 1);
    const filter = buildFilter(req.query.query);
    const sort   = buildSort(req.query.sort);
    const skip   = (page - 1) * limit;

    const [totalDocs, items] = await Promise.all([
      Product.countDocuments(filter),
      Product.find(filter).sort(sort || {}).skip(skip).limit(limit).lean()
    ]);

    const totalPages = Math.max(Math.ceil(totalDocs / limit), 1);
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    res.json({
      status: 'success',
      payload: items,
      totalPages,
      prevPage: hasPrevPage ? page - 1 : null,
      nextPage: hasNextPage ? page + 1 : null,
      page,
      hasPrevPage,
      hasNextPage,
      prevLink: hasPrevPage ? buildLink(req, page - 1) : null,
      nextLink: hasNextPage ? buildLink(req, page + 1) : null
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ status: 'error', error: 'Internal Server Error' });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const p = await Product.findById(req.params.pid).lean();
    if (!p) return res.status(404).json({ status: 'error', error: 'Product not found' });
    res.json({ status: 'success', payload: p });
  } catch {
    res.status(400).json({ status: 'error', error: 'Invalid id' });
  }
};
