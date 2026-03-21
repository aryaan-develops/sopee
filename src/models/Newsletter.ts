import mongoose, { Schema, model, models } from 'mongoose';

const NewsletterSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
});

export default models.Newsletter || model('Newsletter', NewsletterSchema);
