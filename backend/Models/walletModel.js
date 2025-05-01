const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  balance: { type: Number, default: 0 },
  status: { type: String, default: 'pending',
default:'hold'
   },
  
});

module.exports = mongoose.model('Wallet', walletSchema);
