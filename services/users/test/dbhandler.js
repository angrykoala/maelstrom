/*
Name: DBHandler - Test
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for user model
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');

var User = require('../app/models/user.js');
var dbHandler = require('../app/dbhandler.js');
var testUsers = require('./config/users.js');
var auxFunc=require('./config/functions.js');



describe('User Database Handler', function() {
	var db;
	before(function(done) {
		db=auxFunc.connectDB(done);

	});
	beforeEach(function(done) {
		auxFunc.clearUsers(function(err) {
			if (err) done(err);
			else {
				var myuser = new User(testUsers.arthur);
				myuser.save();
				done();
			}
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


	it('Save User', function(done) {
		this.timeout(1500);
		dbHandler.saveUser(testUsers.ford, function(err, usr) {
			assert.notOk(err, "Error: DB Handler save");
			assert.instanceOf(usr, User);
			assert.ok(usr.id);
			assert.strictEqual(usr.email, testUsers.ford.email);
			assert.strictEqual(usr.username, testUsers.ford.username);
			usr.validPassword(testUsers.ford.password, function(err, isValid) {
				assert.notOk(err, "Error: DB Handler save");
				assert.ok(isValid);
				dbHandler.saveUser(testUsers.ford, function(err, usr) {
					assert.ok(err);
				});
				done();
			});
		});

	});
	it('Find User', function(done) {
		this.timeout(1500);
		dbHandler.findUser("Arthur", function(err, usr) {
			assert.notOk(err, "Error: DB Handler find");
			assert.ok(usr.id);
			var id = usr.id;
			assert.strictEqual(usr.username, testUsers.arthur.username);
			assert.strictEqual(usr.email, testUsers.arthur.email);
			assert.notEqual(usr.password, testUsers.arthur.password);
			usr.validPassword(testUsers.arthur.password, function(err, isValid) {
				assert.notOk(err, "Error: DB Handler find");
				assert.ok(isValid);
				dbHandler.findUser("arThur", function(err, usr2) {
					assert.notOk(err);
					assert.strictEqual(usr2.id, id);
					dbHandler.findUser("arthur@dent.com", function(err, usr3) {
						assert.notOk(err);
						assert.strictEqual(usr3.id, id);
						dbHandler.findUser("notanuser", function(err, usr) {
							assert.notOk(err);
							assert.isNull(usr);
							done();
						});
					});
				});
			});
		});
	});
	it('Find User by Id', function(done) {
		this.timeout(1000);
		dbHandler.findUser("Arthur", function(err, usr) {
			assert.notOk(err, "Error: DB Handler find by ID");
			assert.ok(usr);
			assert.ok(usr.id);
			var id = usr.id;
			dbHandler.findById(id, function(err, usr2) {
				assert.notOk(err, "Error: DB Handler find by ID");
				assert.ok(usr);
				assert.strictEqual(usr.username, usr2.username);
				assert.strictEqual(usr.email, usr2.email);
				assert.strictEqual(usr.password, usr2.password);
				assert.strictEqual(usr2.id, id);
				done();
			});

		});
	});
	it('Remove User', function(done) {
		this.timeout(1000);
		dbHandler.findUser("Arthur", function(err, usr) {
			assert.notOk(err, "Error: DB Handler remove user");
			var id = usr.id;
			assert.ok(id);
			dbHandler.removeUser(id, function(err) {
				assert.notOk(err, "Error: DB Handler remove user");
				dbHandler.findUser("Arthur", function(err, usr) {
					assert.notOk(err);
					assert.isNull(usr);
					dbHandler.removeUser(id, function(err) {
						done();
					});

				});
			});
		});
	});
	it.skip('Update User', function(done) {
		dbHandler.findUser("arthur",function(err,usr){
			assert.notOk(err);
			assert.ok(usr.id);
			var oldId=usr.id;
			dbHandler.updateUser(oldId,testUsers.ford,function(err){
				assert.notOk(err);
				dbHandler.findUser("ford",function(err,usr2){
						assert.notOk(err);
						//TODO: fix and complete
						assert.strictEqual(usr2.id,oldId);
						assert.strictEqual(usr2.username,testUsers.ford.username);
						assert.strictEqual(usr2.email,testUsers.ford.email);
						asert.strictEqual(usr2.password,testUsers.ford.password);
						
						done();
					
				});
				
			});

			
		});

	});
});
