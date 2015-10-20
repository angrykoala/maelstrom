/*
Name: API - Test
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for user model
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');
var request = require('supertest');

var User = require('../app/models/user.js');
var testUsers = require('./config/users.js');
var dbConfig = require('./config/server.js');
var auxFunc = require('./config/functions.js');

describe('User API', function() {
	var db;
	var app;
	before(function(done) {
		db = auxFunc.connectDB(function() {
			app = auxFunc.setupServer(done);
		});

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
				auxFunc.closeServer();
				done();
			}
		});
	});
	it.skip('/signup', function(done) {
		var myUser = testUsers.ford;
		request(app).post('/signup').send(myUser).expect(201).end(function(err, res) {
			assert.notOk(err);


			console.log(res.status);
			done()

		});

	});
	it.skip('/login success', function() {


	});
	it.skip('/login failure', function() {


	});
});