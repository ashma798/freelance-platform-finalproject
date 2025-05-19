const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const stripe = require('../StripeConfig/stripe');
const Wallet = require('../Models/walletModel');
const Bid = require('../Models/bidModel');
const jobModel = require('../Models/jobModel');
const userModel = require('../Models/userModel');
const sendEmail = require("../Utils/sendEmail");
const paymentModel = require("../Models/paymentModel");
const bidModel = require("../Models/bidModel");


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
      status: "hold",
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
        {
          $inc: { balance: amount },
          $push: {
            transactions: {
              job_id: jobId,
              amount,
              type: 'credit',
              status: 'pending',
              date: new Date()
            }
          }
        },
        { upsert: true }
      );


      await Wallet.updateOne(
        { user_id: clientId },
        {
          $inc: { balance: -amount },
          $push: {
            transactions: {
              job_id: jobId,
              amount,
              type: 'debit',
              status: 'hold',
              date: new Date()
            }
          }
        },
        { upsert: true }
      );
      await jobModel.findByIdAndUpdate(jobId, { status: 'partialpaid' });
      await jobModel.findByIdAndUpdate(jobId, { freelancer_id: freelancerId });
      const freelancer = await userModel.findById(freelancerId);
      const client = await userModel.findById(clientId);
      const job = await jobModel.findById(jobId);

      if (!freelancer) {
        return res.status(404).json({ error: "Freelancer not found" });
      }

      await sendEmail({
        fromName: client.name,
        fromEmail: client.email,
        to: freelancer.email,
        subject: `Bid Has Been Accepted By ${client.name}!`,
        html: `
       <h2>Congratulations, ${freelancer.name}!</h2>
      <p>Your bid for the project <strong>${job.job_title}</strong> has been accepted, and the initial 50% payment of <strong>₹${amount}</strong> has been transferred to your wallet.</p>
      <p>You can now start working on the project. Make sure to follow up with the client for project details.</p>
      <br/>
      <p>Happy freelancing!<br/>The Freelance Platform Team</p>
    `,
      });

      res.status(200).json({ message: '50% released to freelancer' });
    } catch (err) {
      res.status(500).json({ error: 'Could not release 50%' });
    }
  },


  markAsCompleted = async (req, res) => {
    const { jobId, freelancerId } = req.params;
    try {
      const updateJob = await jobModel.findByIdAndUpdate(jobId, { status: 'completed' }, { new: true });
      if (!updateJob) return res.status(404).json({ error: 'Job not found' });

      const freelancer_id = freelancerId;
      const client_id = updateJob.client_id;
      const bid = await bidModel.findOneAndUpdate(
        { job_id: jobId, status: 'pending' },
        { status: 'completed' },
        { new: true }
      );
      const bidId = bid?._id;
      const client = await userModel.findById(client_id);
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const freelancer = await userModel.findById(freelancer_id);

      if (!freelancer) {
        return res.status(404).json({ message: 'Freelancer not found' });
      }

      const finalPayLink = `https://freelance-platform-finalproject.vercel.app/FinalPayment/${bidId}`; 
      //const finalPayLink = `http://localhost:3000/FinalPayment/${bidId}`;

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
      console.log(err);
      res.status(500).json({ error: 'Failed to notify client' });
    }
  },
  finalDetails = async (req, res) => {
    const { bidId } = req.params;
    try {
      const bid = await bidModel.findById(bidId)
        .populate('job_id')
        .populate('client_id')
        .populate('freelancer_id');

      if (!bid) {
        return res.status(404).json({ success: false, message: 'Bid not found' });
      }

      const jobDetails = {
        title: bid.job_id.job_title,
        description: bid.job_id.job_description,
        budget: bid.job_id.budget,
        status: bid.job_id.status,
        client_id: bid.job_id.client_id,
        _id: bid.job_id._id,
      };

      const initialPayment = bid.bid_amount / 2;
      const remainingAmount = bid.bid_amount - initialPayment;

      res.status(200).json({
        success: true,
        jobDetails,
        initialPayment,
        remainingAmount,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  },

  finalPaymentRelease = async (req, res) => {
    const { jobId, amount } = req.body;

    try {
      const job = await jobModel.findById(jobId).populate('client_id');
      const bid = await bidModel.findOne({ job_id: jobId }).populate('client_id');
      if (!job) {
        return res.status(404).json({ success: false, message: 'Job not found' });
      }
      const freelancerWallet = await Wallet.findOne({ user_id: bid.freelancer_id });
      const clientWallet = await Wallet.findOne({ user_id: job.client_id });

      freelancerWallet.balance += amount;
      clientWallet.balance -= amount;
      freelancerWallet.transactions.push({
        job_id: jobId,
        amount,
        type: 'credit',
        status: 'released',
        date: new Date(),
      });

      clientWallet.transactions.push({
        job_id: jobId,
        amount,
        type: 'debit',
        status: 'paid',
        date: new Date(),
      });

      await freelancerWallet.save();
      await clientWallet.save();

      const freelancer = await userModel.findById(bid.freelancer_id);
      const client = await userModel.findById(job.client_id);

      if (freelancer && freelancer.email) {
        await sendEmail({
          fromEmail: freelancer.email,
          to: client.email,

          subject: `Payment Received for Job: ${job.job_title}.`,

          html: `
        <p>Hi ${client.name},</p>

      <p>I am pleased to inform you that I have successfully received a payment of ₹${amount} for the job titled "${job.job_title}."

        <p>Thank you for your prompt payment. I look forward to continuing our work and delivering the best results.</p>

        Feel free to reach out if you have any questions or further requirements.</p>

        Best regards,
        <p>${freelancer.name}</p>
        <p>FreelanceHub</p>`
        });
      }

      if (client && client.email) {
        await sendEmail({
          fromEmail: client.email,
          to: freelancer.email,
          subject: `Payment Completed for Job: ${job.job_title} `,
          html: `
      <p>  Hi ${freelancer.name},</p>

<p>This is to inform you that the final payment of ₹${amount} for Job : ${job.job_title} has been successfully released.</p>

<p>Thank you for your hard work and dedication on this project. Feel free to reach out if you need any further information or assistance.</p>

Best regards,
<p>${client.name}</p>
<p>FreelanceHub</p>`
        });
      }

      res.status(200).json({ success: true, message: 'Final payment released successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  };


module.exports = {
  markAsCompleted,
  initialPaymentRelease,
  createPayment,
  finalPaymentRelease,
  finalDetails
}