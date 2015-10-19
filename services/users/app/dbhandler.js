/*
Name: DB Handler
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Mongoose database handler
*/


var User = require('./models/user');


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
		if (!username) return done(new Error("Not username or email provided"));
		User.findOne({
			$or: [{
				"username": new RegExp("^" + username, "i")
			}, {
				"email": username
			}]
		}, done);
	},
	findById: function(userId, done) {
		if (!userId) return done(new Error("Not id provided"));
		else User.findOne({
			_id: userId
		}, done);
	},
	//Saves user if everything is correct and there is not other user with same username/email
	//userInfo should have the necessary user information (username,password and email)
	saveUser: function(userInfo, done) {
		//	if (!userInfo.username || !userInfo.email || !userInfo.password) done(new Error("Save: User info incorrect"));
		isUser(userInfo.username, userInfo.email, function(err, isUser) {
			if (err) done(err);
			else if (isUser === true) done(new Error("Save: User already exists"));
			else {
				var newUser = new User({
					username: userInfo.username,
					email: userInfo.email,
					password: userInfo.password
				});
				newUser.save(function(err) {
					done(err, newUser);
				});
			}
		});
	},
	removeUser: function(userId, done) {
		this.findById(userId, function(err, result) {
			if (err) done(err);
			else if (result) {
				result.remove(function(err) {
					done(err);
				});
			} else done(new Error("Remove: user not found or invalid password"));
		});
	},
	updateUser: function(username, changes, done) {
		//TODO: solve issue #25

	}
};
module.exports = Handler;