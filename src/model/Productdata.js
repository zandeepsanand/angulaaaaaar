const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Angular');
const Schema = mongoose.Schema;

var NewProductSchema = new Schema({
    title :String,
    description:String,
    genre:String,
    author:String,
imageUrl:String
});

var Productdata = mongoose.model('product', NewProductSchema);                        //UserData is the model and NewBookData is the schema

module.exports = Productdata;