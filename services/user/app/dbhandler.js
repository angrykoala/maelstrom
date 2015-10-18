/*
Name:
Version:
Author:
Description:
*/

var User = require('./models/user');

//MongoDB
var mongoose = require('mongoose');
var dbConfig = require('../config/database.js');
mongoose.connect(dbConfig.url);

var db = mongoose.connection;
db.on('error', function(err) {
	console.error('DB connection error:' + err);
});

db.once('open', function() {
	console.log("database opened");
});

//calls done with boolean value if user with username or email exists
function isUser(username, email, done) {
	Handler.findUser(username, function(err,res) {
			if (res) done(err,true);
			else {
				Handler.findUser(email, function(err,res){
					if (res) done(err,true);
					else done(err,false);
				});
		}
	});
}

var Handler = {
    //find user given username/email
    findUser: function(username, done) {
	User.findOne({
	    $or: [{
		"username": username
	    }, {
		"email": username
	    }]
	}, done);
    },
    //saves user if userInfo is correct and the is not user with same username or email
    //userInfor should have the necessary user information (username,password and email)
    saveUser: function(userInfo, done) {
	if (!userInfo.username || !userInfo.email) done(new Error("User info incorrect"));
	else isUser(userInfo.username, userInfo.email, function(err,isUser) {
	    if(err) done(err);
	    else if (isUser === true) done(new Error("User already exists"));
	    else {
		var newUser = new User({
		    username: userInfo.username,
		    email: userInfo.email
		});
		if (userInfo.password.length < 4 || userInfo.password.length > 25) done(new Error("Not valid password"));
		else {
		    newUser.password = User.generateHash(userInfo.password);
		    newUser.save(function(err) {
			done(err, newUser);
		    });
		}
	    }
	});
    },
    removeUser: function(username, password, done) {
	/*findUser(username, function(result) {
	  if (result) {
	  if (result.validPassword(password)) {
	  User.remove({
	  _id: result._id
	  }, function(err) {
	  if (err) console.log(err);
	  done();
	  }
	  }
	  }
	  done();
	  });*/
    }
};
module.exports=Handler;
