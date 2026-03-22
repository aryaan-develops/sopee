import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false,
  },
  role: {
    type: String,
    enum: ['buyer', 'seller', 'admin'],
    default: 'buyer',
  },
  phone: {
    type: String,
    default: '',
  },
  addresses: [{
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    isDefault: {
      type: Boolean,
      default: false,
    }
  }],
  preferredDelivery: {
    type: String,
    enum: ['Standard', 'Express', 'Next-Day'],
    default: 'Standard',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.User || model('User', UserSchema);
