/*
Name: Users Model - Test
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for user model
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');

var User = require('../app/models/user.js');
var testUsers = require('./config/users.js');
var auxFunc=require('./config/functions.js');

describe('User Model', function() {
	var db;
	before(function(done) {
		db=auxFunc.connectDB(done);
	});
	beforeEach(function(done) {
		auxFunc.clearUsers(function(err) {
			if (err) done(err);
			else done();
		});
	});
	after(function(done) {
		auxFunc.clearUsers(function(err) {
			if (err) done(err);
			else {
				db.close();
				done();
			}
		});
	});
	it('Document creation', function(done) {
		this.timeout(2500);
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
				userTest = new User(testUsers.arthur);//inserting same user twice
				userTest.save();
				User.find({}, function(err, res) {
					assert.notOk(err, "Error:User.find");
					assert.strictEqual(res.length, 2);
					done();
				});
			});
		});
	});
	it('Document creation rules', function(done) {
		this.timeout(2500);

		var correctUsers = 0;
		for (var key in testUsers) {
			if (testUsers.hasOwnProperty(key)) {
				if (testUsers[key].correct === true) correctUsers++;
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
	it('Password Validation', function(done) {
		this.timeout(2000);
		var newUser = new User(testUsers.arthur);
		newUser.save();
		User.find({
			_id: newUser.id
		}, function(err, usr) {
			assert.notOk(err, "Error: Password validation");
			assert.strictEqual(usr.length, 1);
			usr[0].validPassword(testUsers.arthur.password, function(err, res) {
				assert.notOk(err, "Error: Password validation");
				assert.ok(res);
				usr[0].validPassword("dontpanic43", function(err, res) {
					assert.notOk(err, "Error: Password validation");
					assert.strictEqual(res, false);
					done();
				});
			});
		});
	});
});
