const mongoose = require('mongoose');
const invitationSchema = new  mongoose.Schema({
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
    job_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"jobs",
        required:true
    },
    status:
    {
        type:String,
        enum:['pending', 'accepted', 'declined'],
        default : 'pending',
        required : false

    }
   
    
},
{
    timeStamps:true
});

    
const invitations = new mongoose.model("invitations",invitationSchema);
module.exports = invitations;














