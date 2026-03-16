import mongoose, { Schema, model, models } from 'mongoose';

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
  stripeSessionId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Order || model('Order', OrderSchema);
