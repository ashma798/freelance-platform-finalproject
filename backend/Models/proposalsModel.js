
const mongoose = require('mongoose');
const proposalSchema = new  mongoose.Schema({
    freelancer_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    client_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    job_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"jobs",
        required:true

    },
    cover_letter:{
        type: String
       
    },
    proposed_budget:{
        type:mongoose.Schema.Types.Decimal128,
        required:true
    },
    
    status:{
        type:String,
        enum:['pending','accepted','rejected'],
        default : 'pending',
        required : true
    }
  
    
},
{
    timeStamps:true
});

    
const proposal = new mongoose.model("proposals",proposalSchema);
module.exports = proposal;

