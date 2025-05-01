
const mongoose = require('mongoose');
const jobSchema = new mongoose.Schema({
    client_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    job_title:
    {
        type: String,
        required: true

    },
    description: {
        type: String

    },
    budget: {
        type: mongoose.Types.Decimal128,
        required: true
    },
    skills_required:
    {
        type: [String],
        required: true
    },
    deadline:
    {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
        required: true
    }


},
    {
        timestamps: true
    });

const jobModel = mongoose.model('Jobs', jobSchema);
module.exports = jobModel;






