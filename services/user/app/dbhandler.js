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

//Calls done with boolean value if user with username or email exists
function isUser(username, email, done) {
	Handler.findUser(username, function(err, res) {
		if (res) done(err, true);
		else {
			Handler.findUser(email, function(err, res) {
				if (res) done(err, true);
				else done(err, false);
			});
		}
	});
}

var Handler = {
	//Find user given username/email
	findUser: function(username, done) {
		User.findOne({
			$or: [{
				"username": username
			}, {
				"email": username
			}]
		}, done);
	},
	//Saves user if everything is correct and there is not other user with same username/email
	//userInfo should have the necessary user information (username,password and email)
	saveUser: function(userInfo, done) {
		if (!userInfo.username || !userInfo.email) done(new Error("Save: User info incorrect"));
		else isUser(userInfo.username, userInfo.email, function(err, isUser) {
			if (err) done(err);
			else if (isUser === true) done(new Error("Save: User already exists"));
			else {
				var newUser = new User({
					username: userInfo.username,
					email: userInfo.email
				});
				if (userInfo.password.length < 4 || userInfo.password.length > 25) done(new Error("Save: Not valid password"));
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
		findUser(username, function(err, result) {
			if (err) done(err);
			else {
				if (result && result.validPassword(password)) {
					result.remove(function(err) {
						done(err);
					});


				} else done(new Error("Remove: user not found or invalid password"));

			}

		});
	}
};
module.exports = Handler;
