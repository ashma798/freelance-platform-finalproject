const mongoose = require('mongoose');
const bidSchema = new mongoose.Schema({
    client_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    freelancer_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    job_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Jobs",
        required: true
    },

    bid_amount: {
        type: Number,
        required: true
    },
    status:
    {
        type: String,
        enum: ['pending', 'accepted', 'partial', 'paid'],
        default: 'pending',
        required: false

    }


},  {
        timeStamps: true
    });


const bid = new mongoose.model("bid", bidSchema);
module.exports = bid;














