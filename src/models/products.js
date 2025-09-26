const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, index: true },
  stock: { type: Number, default: 0, min: 0 },
  status: { type: Boolean, default: true },
  thumbnails: [{ type: String }]
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);

module.exports = model('Product', productSchema);
