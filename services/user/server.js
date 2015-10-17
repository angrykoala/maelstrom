/*
Name: User Service
Project: Mäelstrom
Version: 0.0.1
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Users microsevice for maelstrom using mongoose
*/

//MongoDB
var mongoose = require('mongoose');
var dbConfig = require('./config/database.js');
mongoose.connect(dbConfig.url);

var db = mongoose.connection;
db.on('error', function(err) {
	console.error('DB connection error:' + err);
});

db.once('open', function() {
	console.log("database opened");



	var express = require('express');
	var app = express();
	var port = process.env.PORT || 8080;

	var bodyParser = require('body-parser');
	app.use(bodyParser()); // get information from body

	require('./app/routes.js')(app);

	app.listen(port, function() {
		console.log("Server listening on port " + port);
	});

});
/* 
db.once('open', function (callback) {
  var userSchema = mongoose.Schema({
    name: String,
    password: Number
});


// NOTE: methods must be added to the schema before compiling it with mongoose.model()
userSchema.methods.welcome = function () {
  console.log("Hello "+ this.name);
}

var User = mongoose.model('User', userSchema);

var myUser=new User({name: "Zaphod2",password: 42});
//myUser.save();
//console.log("Well");
/*myUser.welcome();
myUser.save(function (err, myUser) {
  if (err) return console.error(err);
  else console.log("Saved");
  User.find(function (err, users) {
	  if (err) return console.error(err);
	  console.log(users);
	});
});

User.find({ name: "Zaphod" }, function(err,result){
 if (err) return console.error(err);
	console.log(result);
	result[0].welcome();
	db.close();
});


//db.close();
  */