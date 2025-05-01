const mongoose = require('mongoose');
const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true

    },
    phone:{
        type:Number,
        required:true
        
    },
    country:{
        type:String,
        required:true

    },
    role: {
        type: String,
        enum: ['admin', 'client', 'freelancer'],
        default: 'client'
      },
    image:
    {
        type:String,
        required: false


    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
    
},

{
    timeStamps:true
});

    
const User = new mongoose.model("users",userSchema);
module.exports = User;



