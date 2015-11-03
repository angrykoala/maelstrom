/*
Name: Users Model - Test
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for user model
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');
var async = require('async');

var User = require('../app/models/user.js'); //user schema
var testUsers = require('./config/users.js'); //users data for testing
var auxFunc = require('./config/functions.js');

describe('User Model', function() {
	this.timeout(4000);
	var db;
	before(function(done) {
		db = auxFunc.connectDB(done);
	});
	beforeEach(function(done) {
		auxFunc.clearUsers(function(err) {
			assert.notOk(err);
			done();
		});
	});
	after(function(done) {
		auxFunc.clearUsers(function(err) {
			assert.notOk(err);
			db.close(done);
		});
	});
	it('Document creation', function(done) {
		var userTest;
		userTest = new User(testUsers.arthur);
		assert.ok(userTest);
		userTest.save(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			User.find({}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, 1);
				userTest = new User(testUsers.ford);
				userTest.save(function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					User.find({}, function(err, res) {
						assert.notOk(err);
						assert.strictEqual(res.length, 2);
						userTest = new User(testUsers.arthur); //inserting same user twice
						userTest.save(function(err, res) {
							assert.ok(err);
							User.find({}, function(err, res) {
								assert.notOk(err);
								assert.strictEqual(res.length, 2);
								done();
							});
						});
					});
				});
			});
		});
	});
	it('Document creation rules', function(done) {
		var correctUsers = 0;
		async.each(Object.keys(testUsers), function(key, callback) {
			if (testUsers.hasOwnProperty(key)) {
				if (testUsers[key].correct === true) correctUsers++;
				var newuser = new User(testUsers[key]);
				assert.ok(newuser);
				newuser.save(function() {
					callback();
				});
			}
		}, function(err) {
			assert.notOk(err);
			User.find({}, function(err, res) {
				assert.notOk(err, "Error: User find");
				assert.strictEqual(res.length, correctUsers);
				done();
			});
		});
	});
	it('Document update', function(done) {
		var newUser = new User(testUsers.arthur);
		newUser.save(function(err, res) {
			assert.notOk(err);
			User.update({
				_id: newUser._id
			}, {
				$set: {
					username: "newusername"
				}
			}, function(err) {
				assert.notOk(err);
				User.find({
					_id: newUser._id
				}, function(err, res) {
					assert.notOk(err);
					assert.strictEqual(res.length, 1);
					assert.strictEqual(res[0].username, "newusername");
					assert.strictEqual(auxFunc.checkPassword(testUsers.arthur.password, res[0].password), true);
					User.update({
						_id: newUser._id
					}, {
						$set: {
							password: "newpassword",
							email: "mynewmail@hotmail.com"
						}
					}, function(err) {
						assert.notOk(err);
						User.find({
							_id: newUser._id
						}, function(err, res) {
							assert.notOk(err);
							assert.strictEqual(res.length, 1);
							assert.strictEqual(res[0].email, "mynewmail@hotmail.com");
							res[0].validPassword("newpassword", function(err, res) {
								assert.notOk(err);
								assert.ok(res);
								done();
							});
						});
					});
				});
			});
		});
	});

	it('Password Validation', function(done) {
		var newUser = new User(testUsers.arthur);
		newUser.save(function(err) {
			assert.notOk(err);
			User.find({
				_id: newUser.id
			}, function(err, usr) {
				assert.notOk(err);
				assert.strictEqual(usr.length, 1);
				usr[0].validPassword(testUsers.arthur.password, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					usr[0].validPassword("dontpanic43@#&/", function(err, res) {
						assert.notOk(err, "Error: Password validation");
						assert.strictEqual(res, false);
						usr[0].validPassword("dontñpanic42@/&}", function(err, res) {
							assert.ok(err);
							assert.strictEqual(res, false);
							done();
						});
					});
				});
			});
		});
	});
});