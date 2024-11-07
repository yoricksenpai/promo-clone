// models/rankItem.js
import mongoose from 'mongoose';

const rankItemSchema = new mongoose.Schema({
  siteName: {
    type: String,
    required: true,
    unique: true
  },
  logo: {
    type: String,
    required: true
  },
  advantages: {
    type: [String],
    required: true
  },
  welcomeBonus: {
    type: String,
    required: true
  },
  payments: {
    type: [String],
    required: true
  },
  promoCode: {
    type: String,
    required: true
  },
  rank: {
    type: Number,
    required: true,
    unique: true
  }
}, {
  timestamps: true
});

export default mongoose.model('RankItem', rankItemSchema);