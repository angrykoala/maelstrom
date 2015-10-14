var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

	//User Serialization
	//get only minimal data for the user in session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	//retrieve full user data
	passport.deserializeUser(function(userId, done) {
		User.findById(userId, function(err, user) {
			done(err, user);
		});
	});

	//Local login Strategy
	passport.use('local-login', new LocalStrategy({
				usernameField: 'username',
				passwordField: 'password'
			}, function(username, password, done) {
				User.findOne({
						$or: [{
								"username": username
							}, {
								"email": username]
						},
						function(err, user) {
							if (err) return done(err);
							else if (!user) {
								console.log("User Not found");
								return done(null, false); //flash message!!
							} else if (!user.validPassword(password)) {
								console.log("Incorrect password");
								return done(null, false);
							} else return done(null, user);
						});
				}));

		},

}