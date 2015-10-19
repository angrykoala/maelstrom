/*
Name: DBHandler - Test
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for user model
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');

var User = require('../app/models/user.js');
var dbHandler = require('../app/dbhandler.js');
var testUsers = require('./config/users.js');
var dbConfig = require('./config/database.js');



describe('User Database Handler', function() {
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
				var myuser = new User(testUsers.arthur);
				myuser.save();
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


	it('Save User', function(done) {
		this.timeout(1500);
		dbHandler.saveUser(testUsers.ford, function(err, usr) {
			assert.notOk(err, "Error: DB Handler save");
			assert.instanceOf(usr, User);
			assert.ok(usr._id);
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
		dbHandler.findUser("Arthur", function(err, usr) {
			assert.notOk(err, "Error: DB Handler find");
			assert.ok(usr._id);
			var id = usr._id;
			assert.strictEqual(usr.username, testUsers.arthur.username);
			assert.strictEqual(usr.email, testUsers.arthur.email);
			assert.notEqual(usr.password, testUsers.arthur.password);
			usr.validPassword(testUsers.arthur.password, function(err, isValid) {
				assert.notOk(err, "Error: DB Handler find");
				assert.ok(isValid);
				dbHandler.findUser("arThur", function(err, usr2) {
					assert.notOk(err);
					assert(usr2._id.equals(id));
					dbHandler.findUser("arthur@dent.com", function(err, usr3) {
						assert.notOk(err);
						assert(usr3._id.equals(id));
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
	it.skip('Remove User', function() {


	});
	it.skip('Update User', function() {


	});

});


function clearCollection(done) {
	User.remove({}, function(err, res) {
		if (err) done(err);
		else done();
	});
}