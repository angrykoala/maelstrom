/*
Name:
Version:
Author:
Description:
*/

var emailregexp = "/^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i";

// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		minlength: [4, "Username too short"],
		maxlength: 25
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	}
});

// methods
// generating a hash
userSchema.statics.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
	if (password.length < 8 || password.length > 25) return false;
	return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('user', userSchema);