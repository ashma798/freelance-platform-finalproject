const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema({
  payment_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "payment", 
    required: true 
  },
  freelancer_id: { 
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
      enum: ["scheduled", "processing", "completed", "failed"], 
      default: "scheduled" 
    },
  payout_date: { type: Date },
  method: { type: String },
  reference_number: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Payout", payoutSchema);
