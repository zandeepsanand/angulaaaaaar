const mongoose =require ('mongoose');


// for connecting database

mongoose.connect('mongodb://localhost:27017/Angular');
// to create schema

const schema=mongoose.Schema;

// structure of schema

const signupSchema= new schema({
    username:String,
    email:String,
    
    password:String
});


// model creation

var Signupdata= mongoose.model('signupdata',signupSchema);

// to export to app.js

module.exports=Signupdata;