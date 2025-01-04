const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  get: { type: Number, required: true },
  pay: { type: Number, required: true },
  price: { type: Number, required: true }
});

const productDetailsSchema = new mongoose.Schema({
  quantity: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  typePromotion: [promotionSchema]
});

const productSchema = new mongoose.Schema({
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
  promotion: { type: Boolean, default: false },
  details: productDetailsSchema
});

const hallSchema = new mongoose.Schema({
  hall: { type: String, required: true },
  promotion: { type: Boolean, default: false },
  imageHall: { type: String, required: true },
  products: [productSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('Hall', hallSchema);