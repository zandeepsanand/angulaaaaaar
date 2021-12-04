const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://usertwo:usertwo@ictak.05key.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');
const Schema = mongoose.Schema;

var NewProductSchema = new Schema({
    
    description:String,
    
    author:String,
imageUrl:String
});

var AuthorData = mongoose.model('author', NewProductSchema);                        //AuthorData is the model and NewBookData is the schema

module.exports = AuthorData;