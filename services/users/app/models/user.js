/*
Name: User Schema
Project: Maelström - Users
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
		match: [dbConfig.regexp.user, 'Invalid username'],
		unique: true
	},
	email: {
		type: String,
		required: true,
		match: [dbConfig.regexp.email, 'Invalid mail'],
		unique: true

	},
	password: {
		type: String,
		required: true,
	}
});

//Will fire before save checking password and hashing it
userSchema.pre('save', function(next) {
	var doc = this;
	//only works if password is being modified or is new
	if (!doc.isModified('password')) return next();
	if (!dbConfig.regexp.password.test(doc.password)) return next(new Error("Save: Password not valid"));
	this.password = bcrypt.hashSync(this.password);
	next();
	//Async hash doesnt work
	/*	bcrypt.hash(doc.password, null,null, function(err,hash){
		if (err) return next(err);
		doc.password=hash;
		next();
	});*/
});
userSchema.pre('update', function() {
	var query=this._update.$set;
	if(query["password"]){
		if (!dbConfig.regexp.password.test(query.password)){
			delete(query["password"]);
			//return next(new Error("Save: Password not valid"),this);
		 }
		else query.password = bcrypt.hashSync(query.password);  
		}
  //	next(null);
});
// Methods

// Checks if password is valid
userSchema.methods.validPassword = function(password, done) {
	if (!dbConfig.regexp.password.test(password)) return done(new Error("Invalid characters in password"), false);
	else bcrypt.compare(password, this.password, function(err, res) {
		return done(err, res);
	});
};

// create the model for users and expose it to our app
module.exports = mongoose.model(dbConfig.schema.user, userSchema);
