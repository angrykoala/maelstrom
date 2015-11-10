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

//Exported handler
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
	//Find user by id
	findById: function(userId, done) {
		if (!userId) return done(new Error("Not id provided"));
		else User.findOne({
			_id: userId
		}, done);
	},
	//Saves user if everything is correct and there is not other user with same username/email
	//userInfo should have the necessary user information (username,password and email)
	saveUser: function(userInfo, done) {
		if (!userInfo.username || !userInfo.email || !userInfo.password) done(new Error("Save: User info incorrect"));
		isUser(userInfo.username, userInfo.email, function(err, isUser) {
			if (err) done(err);
			else if (isUser === true) done(new Error("Save: User already exists"));
			else {
				var newUser = new User({
					username: userInfo.username,
					email: userInfo.email,
					password: userInfo.password
				});
				newUser.save(function(err, res) {
					done(err, res);
				});
			}
		});
	},
	//remove the user with given id
	removeUser: function(userId, done) {
		this.findById(userId, function(err, result) {
			if (err) done(err);
			else if (result) {
				result.remove(function(err) {
					done(err);
				});
			} else done(new Error("Remove: user not found"));
		});
	},
	//update user with given ID, making given changes
	updateUser: function(userId, changes, done) {
		if (!userId) done(new Error("No id provided"));
		else {
			isUser(changes.username, changes.email, function(err, res) {
				if (!res) {
					User.update({
						_id: userId
					}, {
						$set: changes
					}, done);
				} else done(new Error("username/email already exists"));
			});
		}
	}
};
module.exports = Handler;
