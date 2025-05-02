const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const stripe = require('../StripeConfig/stripe');
const Wallet = require('../Models/walletModel');
const Bid = require('../Models/bidModel');
const Job = require('../Models/jobModel');
const userModel = require('../Models/userModel');
const sendEmail = require("../Utils/sendEmail");
const paymentModel = require("../Models/paymentModel");

const createPayment = async (req, res) => {
  try {
  
    const { clientId, jobId, amount } = req.body;

    if (!clientId || !jobId || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, 
      currency: "inr",
      metadata: { jobId, client_id: clientId },
    });

    const newPayment = new paymentModel({
      client_id: clientId,
      job_id: jobId,
      amount,
      status: "pending",
      method: "card",
      payment_intent_id: paymentIntent.id,
    });

    await newPayment.save();
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error in createPayment:", err);
    res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      error: err.message
    });
  }
},
initialPaymentRelease = async (req, res) => {
  const { clientId, freelancerId, jobId, amount } = req.body;
  try {
    await Wallet.updateOne(
      { user_id: freelancerId },
      { $inc: { balance: amount } },
      { upsert: true }
    )
    await Wallet.updateOne(
      { user_id: clientId },
      { $inc: { balance: -amount } },
      { upsert: true }
    );
    await Job.findByIdAndUpdate(jobId, { status: 'in_progress' });

    res.status(200).json({ message: '50% released to freelancer' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not release 50%' });
  }
},


markAsCompleted = async (req, res) => {
  const { jobId } = req.params; 
  try {
    const updateJob = await Job.findByIdAndUpdate(jobId, { status: 'completed' });
    if (!updateJob) return res.status(404).json({ error: 'Job not found' });

    const freelancer_id = updateJob.freelancer_id;
    const client_id = updateJob.client_id;
    const bid = await Bid.findOne({ jobId }); 
    const bidId = bid?._id;

    const client = await userModel.findById(client_id);
    const freelancer = await userModel.findById(freelancer_id);

    const finalPayLink = `http://localhost:3000/Payment/Payment?bidId=${bidId}`;

    await sendEmail({
      fromEmail: freelancer.email,
      to: client.email,
      subject: `${freelancer.name} has requested you to release final payment`,
      html: `
        <p>Hi ${client.name},</p>
        <p>${freelancer.name} has marked the project as completed. Please release the final payment.</p>
        <p><a href="${finalPayLink}">Release Payment</a></p>
        <p>Best regards,<br/>${freelancer.name}</p>
      `,
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Marked as completed and email sent',
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to notify client' });
  }
},


finalPayment = async (req, res) => {
  const { freelancerId, amount } = req.body;
  try {
    await Wallet.updateOne(
      { userId: freelancerId },
      { $inc: { balance: amount },
      $set: { status: 'released' } }
    );

    res.status(200).json({ message: 'Remaining 50% released' });
  } catch (err) {
    res.status(500).json({ error: 'Could not release payment' });
  }
};

module.exports = {
  finalPayment,
  markAsCompleted,
  initialPaymentRelease,
  createPayment
}