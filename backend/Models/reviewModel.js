const mongoose = require('mongoose');
const reviewSchema = new  mongoose.Schema({
    reviewer_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true

    },
    reviewee_id:
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true
    },
    
    start_date:{
        type:Date,
        required:true
       
    },
    end_date:{
        type:Date,
        required:true
       
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
      },
      comment: {
        type: String,
        trim: true
      },
  
    status:{
        type:String,
        enum: ['active','completed'],
        default : 'active',
        required : true
    }
  
    
},
{
    timeStamps:true
});

    
const review = new mongoose.model("review",reviewSchema);
module.exports = review;


