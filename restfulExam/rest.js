var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));

var users = [];
app.get('/user', function(req,res){
	res.send(JSON.stringify(users));
});
app.get('/user:id', function(req,res){
	res.send(JSON.stringify({}));
});
app.post('/user', function(req,res){
	res.send(JSON.stringify({}));
});
app.pet('/user/:id', function(req,res){
	res.send(JSON.stringify({}));
});
app.delete(('/user/:id', function(req,res){
	res.send(JSON.stringify({}));
});

app.listen(52273, function(){
	console.log('Server Running');
});