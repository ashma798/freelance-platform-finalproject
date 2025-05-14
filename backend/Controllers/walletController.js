const walletModel = require('../Models/walletModel');
const mongoose = require('mongoose');

 getWalletDetails = async (req, res) => {
  const { freelancerId } = req.params;
  try {
    const wallet = await walletModel.findOne({ user_id:freelancerId }).populate('transactions.job_id');
    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }
    res.status(200).json(wallet);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
},

withdrawFunds = async (req, res) => {
  const { freelancerId, amount } = req.body;

  try {
    const wallet = await walletModel.findOne({ user_id: freelancerId });

    if (!wallet) {
      return res.status(404).json({ message: 'Wallet not found' });
    }

    if (wallet.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    wallet.balance -= amount;
    wallet.transactions.push({
      amount,
      type: 'debit',
      status: 'paid',
      date: new Date(),
    });

    await wallet.save();

    res.status(200).json({
      message: 'Withdrawal successful',
      balance: wallet.balance,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  getWalletDetails,
  withdrawFunds,
};
