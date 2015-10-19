/*
Name: Users Model - Test
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for user model
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');

var User = require('../app/models/user.js');
var testUsers = require('./config/users.js');
var dbConfig = require('./config/database.js');


describe('User Model', function() {
	var db;
	before(function(done) {
		mongoose.connect(dbConfig.url);
		db = mongoose.connection;
		db.on('error', function(err) {
			done(err);
		});
		db.once('open', function() {
			done();
		});

	});
	beforeEach(function(done) {
		clearCollection(function(err) {
			if (err) done(err);
			else {

				//insert messages    
				done();
			}
		});
	});
	after(function(done) {
		clearCollection(function(err) {
			if (err) done(err);
			else {
				db.close();
				done();
			}
		});
	});
	it('Document creation', function(done) {
		this.timeout(1500);
		var userTest;
		userTest = new User(testUsers.arthur);
		userTest.save();
		User.find({}, function(err, res) {
			assert.strictEqual(res.length, 1);
			userTest = new User(testUsers.ford);
			userTest.save();
			User.find({}, function(err, res) {
				assert.notOk(err, "Error:User.find");
				assert.strictEqual(res.length, 2);
				done();
			});
		});
	});
	it('Document creation rules', function(done) {
		this.timeout(3500);

		var correctUsers = 0;
		for (var key in testUsers) {
			if (testUsers.hasOwnProperty(key)) {
				if (testUsers[key].correct == true) correctUsers++;
				var newuser = new User(testUsers[key]);
				newuser.save();
			}
		}
		User.find({}, function(err, res) {
			assert.notOk(err, "Error: User find");
			assert.strictEqual(res.length, correctUsers);
			for (var key in testUsers) {
				if (testUsers.hasOwnProperty(key)) {
					var newuser = new User(testUsers[key]);
					newuser.save();
				}
			}
			User.find({}, function(err, res) {
				assert.notOk(err, "Error: User find");
				assert.strictEqual(res.length, correctUsers);
				done();
			});
		});
	});
	it('Password Validation', function(done) {
		this.timeout(2000);
		var newUser = new User(testUsers.arthur);
		newUser.save();
		User.find({
			_id: newUser._id
		}, function(err, usr) {
			assert.notOk(err, "Error: Password validation");
			assert.strictEqual(usr.length, 1);
			usr[0].validPassword(testUsers.arthur.password, function(err, res) {
				assert.notOk(err, "Error: Password validation");
				assert.strictEqual(res, true);
				usr[0].validPassword("dontpanic43", function(err, res) {
					assert.notOk(err, "Error: Password validation");
					assert.strictEqual(res, false);
					done();
				});
			});
		});
	});
});


function clearCollection(done) {
	User.remove({}, function(err, res) {
		if (err) done(err);
		else done();
	});
}
