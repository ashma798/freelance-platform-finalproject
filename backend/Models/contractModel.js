const mongoose = require('mongoose');
const contractSchema = new  mongoose.Schema({
    job_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"jobs",
        required:true

    },
    client_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true

    },
    freelancer_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    
    start_date:{
        type:Date,
        required:true,
       
    },
    end_date:{
        type:Date,
        required:true,
       
    },
  
    status:{
        type:String,
        enum:['active','completed'],
        default : 'active',
        required : true
    }
  
    
},
{
    timeStamps:true
});

    
const contracts = new mongoose.model("contracts",contractSchema);
module.exports = contracts;

