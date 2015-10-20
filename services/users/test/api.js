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
	it('/signup', function(done) {
		var myUser = testUsers.ford;
		request(app).post('/signup').send(myUser).expect(201).end(function(err, res) {
			assert.notOk(err);
			User.find({
				username: myUser.username
			}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, 1);
				assert.ok(res[0]);
				assert.strictEqual(res[0].email, myUser.email);
				request(app).post('/signup').send(myUser).expect(500).end(function(err, res) {
					assert.notOk(err);
					assert.property(res.body, "error");
					assert.ok(res.error);
					request(app).post('/signup').send({
						username: "Marvin"
					}).expect(400).end(function(err, res) {
						assert.notOk(err);
						assert.property(res.body, "error");
						assert.ok(res.error);
						done();
					});
				});
			});
		});
	});
	it('/login', function(done) {
		this.timeout(2500);
		var myUser = testUsers.arthur;
		request(app).post('/login').send({
			username: myUser.username,
			password: myUser.password
		}).expect(200).end(function(err, res) {
			assert.notOk(err);
			//TODO:check JWT
			request(app).post('/login').send({
				username: myUser.email,
				password: myUser.password
			}).expect(200).end(function(err, res) {
				assert.notOk(err);
				//TODO: compare JWT
				request(app).post('/login').send({
					username: myUser.username
				}).expect(500).end(function(err, res) {
					assert.notOk(err);
					assert.property(res.body, "error");
					assert.ok(res.error);
					request(app).post('/login').send(testUsers.ford).expect(404).end(function(err, res) {
						assert.notOk(err);
						assert.property(res.body, "error");
						assert.ok(res.error);
						done();
					});
				});
			});
		});
	});
});