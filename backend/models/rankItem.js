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
  },
  createAccountUrl: {
    type: String,
    required: false // Pas nécessaire pour tous les sites
  },
  downloadAppUrl: {
    type: String,
    required: false // Pas nécessaire pour tous les sites
  }
}, {
  timestamps: true
});

export default mongoose.model('RankItem', rankItemSchema);