/*
Name:
Version:
Author:
Description:
*/

var User = require('./models/user');


module.exports = {
		//find user given username/email
		findUser: function(username, done) {
			User.findOne({
					$or: [{
						"username": name
					}, {
						"email": mail
					}]
				},
				function(err, result) {
					if (err) {
						console.error(err);
						done();
					} else done(result);
				});
		},
		saveUser: function(user_info, done) {
			//check it doesn't exists
			var newUser = new User({
				username: user_info.username,
				email: user_info.email
			});
			if (user_info.password.length < 4 || user_info.password.length > 25) console.log("user error");
			newUser.password = newUser.generateHash(user_info.password);
			newUser.save(function(err) {
					if (err) console.log(err);
					done();
				);
			}
		},
		removeUser: function(username, password, done) {
			findUser(username, function(result) {
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
					});
			}
		};