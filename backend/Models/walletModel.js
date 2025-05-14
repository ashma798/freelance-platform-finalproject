const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  balance: { type: Number, default: 0 },
  transactions: [
    {
      job_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Jobs' },
      amount: {type :Number , default:0 },
      type: { type: String, enum: ['credit', 'debit','hold'] },
      status: { type: String, enum: ['pending', 'released', 'paid','hold'] },
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('Wallet', walletSchema);
