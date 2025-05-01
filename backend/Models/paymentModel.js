const mongoose = require("mongoose");
const paymentSchema = new mongoose.Schema({
    job_id: {
       type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
         required: true 
        },
    client_id: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "users",
        required: true
       },
    amount: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String,
       enum: ["pending", "paid", "refunded", "failed"],
        default: "pending" 
      },
   
    method: {
      type: String
    },
    payment_intent_id: {  
      type: String
    },
    transactionId: {  
      type: String
    }
  }, {
    timestamps: true
  });

  
    
  const payment = mongoose.model("payments", paymentSchema);
  module.exports = payment;