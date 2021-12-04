const express = require('express');
const path = require('path');

var port = process.env.PORT || 3000;

const bcrypt=require('bcrypt');
const Signupdata=require('./src/model/Signupdata');
const Admindata=require('./src/model/Admindata');
const ProductData = require('./src/model/Productdata');

const cors = require('cors');
var app = new express();
app.use(cors());
app.use(express.json());
const jwt=require('jsonwebtoken');
const AuthorData = require('./src/model/AuthorData');

app.use(express.static('./dist/libraryApp-Angular'));


app.post('/api/adduser',async function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
     console.log(req.body);
    var item={ 
        email: req.body.user.email,
        username: req.body.user.username,
        password: req.body.user.password
        
     }
     console.log(item);

    item.password = await bcrypt.hash(item.password,10);
    console.log(item.password);
    var user = Signupdata(item);
    user.save(); //save to database
    });



app.post('/api/user/login',function (req, res) {
    // let userData = req.body;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");

    const username = req.body.username;
    const password = req.body.password;

    console.log(req.body);
    Signupdata.findOne({'username': username},function(err,User){
        console.log("inside signup");
         if(User){
             console.log(User);
            bcrypt.compare(password,User.password)
            .then((status)=>{
                if(status){
                    console.log(status);
                    console.log(username,password);
                    console.log("success");
                    let payload = {subject: username + password};
                    let token = jwt.sign(payload,'userKey');
                    res.status(200).send({token,role:'user'});
                    console.log("logged in");
                
                    }
                    else{
                        console.log("Incorrect Credentials");
                    
                    }
            });
        }
        else if(!User){
            if(username == 'admin'){
                Admindata.findOne({ 'username': username, 'password': password}, function (err, admin) {
                    console.log(admin);
                    console.log("inside admin");
                    if (admin) {
                        console.log(admin);
                        let payload = {subject: username + password};
                        let token = jwt.sign(payload,'adminKey');
                        res.status(200).send({token,role:'admin'});
                        console.log("admin success");
                    } else {
                        console.log('Only Admin can Log in!');
                    }
                });
            }
            
        } 
    });
 });




app.get('/api/books',function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    
    ProductData.find()
                .then(function(products){
                    res.send(products);
                });
});
app.get('/api/authors',function(req,res){

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    AuthorData.find()
    .then(function(products){
        res.send(products);
    });
});
app.post('/api/author/insert', function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
   
    console.log(req.body);
   
    var author = {       
       
        description : req.body.author.description,
       
        author: req.body.author.author,
        
        
        imageUrl : req.body.author.imageUrl
   }       
   var authorData = new AuthorData(author);
 authorData.save();
});







app.post('/api/insert', function(req,res){
   
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body);
   
    var book = {       
        title : req.body.book.title,
        description : req.body.book.description,
        genre : req.body.book.genre,
        author: req.body.book.author,
        
        
        imageUrl : req.body.book.imageUrl
   }       
   var booksData = new ProductData(book);
 booksData.save();
});



app.get('/api/book/:id',  (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
  
    const id = req.params.id;
      ProductData.findOne({"_id":id})
      .then((product)=>{
          res.send(product);
      });
  })
  app.get('/api/author/:id',  (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
  
    const id = req.params.id;
      AuthorData.findOne({"_id":id})
      .then((product)=>{
          res.send(product);
      });
  })

  app.put('/api/author/update',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    console.log(req.body)
    id=req.body._id,
    
    
    
  
    description = req.body.description,
    author = req.body.author,
  
    imageUrl = req.body.imageUrl
   AuthorData.findByIdAndUpdate({"_id":id},
                                {$set:{
                              
                                "description":description,
                                
                                "author":author,
                                "imageUrl":imageUrl}})
   .then(function(){
       res.send();
   })
 })
 app.delete('/api/remove/:id',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
   
    id = req.params.id;
    ProductData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })
  app.delete('/api/remove/author/:id',(req,res)=>{
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
   
    id = req.params.id;
    AuthorData.findByIdAndDelete({"_id":id})
    .then(()=>{
        console.log('success')
        res.send();
    })
  })  
  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/libraryApp-Angular/index.html'))
   });
   


   app.listen(port,()=>{console.log("server Ready at"+port)});
