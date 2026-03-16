import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
  },
  category: {
    type: String,
    required: [true, 'Please provide product category'],
  },
  images: [{
    type: String,
    required: true,
  }],
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Product || model('Product', ProductSchema);
