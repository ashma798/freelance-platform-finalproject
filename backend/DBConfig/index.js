const mongoose = require('mongoose');
const mongoDbUriString = process.env.MONGODB_URI_STRING;
mongoose
.connect(mongoDbUriString)
.then((response)=>{
    console.log("Freelance job platform database is connected");

}).catch((err)=>{
    console.log("connection error:",err);

});

