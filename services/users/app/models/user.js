/*
Name: User Schema
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Users microsevice for maelstrom using mongoose and JWT
*/

// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var dbConfig = require('../../config/database.js');

// define the schema for our user model
var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		match: [dbConfig.regexp.user, 'Invalid username']
	},
	email: {
		type: String,
		required: true,
		match: [dbConfig.regexp.email, 'Invalid mail']

	},
	password: {
		type: String,
		required: true,
	}
});

//Will fire before save checking password and hashing it
userSchema.pre('save', function(next) {
	//only works if password is bein modified or is new
	if (!this.isModified('password')) return next();
	if (!dbConfig.regexp.password.test(this.password)) return next(new Error("Save: Password not valid"));
	this.password = bcrypt.hashSync(this.password);
	next();
	//Async hash doesnt work
	/*bcrypt.hash(this.password, null,null, function(err,hash){
		if (err) return next(err);
		this.password=hash;
		next();
	});*/
});

// Methods

// Checks if password is valid
userSchema.methods.validPassword = function(password,done) {
	if (!dbConfig.regexp.password.test(password)) return done(null,false);
	else bcrypt.compare(password, this.password, function(err, res) {
		return done(err,res);
	});
};

// create the model for users and expose it to our app
module.exports = mongoose.model('user', userSchema);
