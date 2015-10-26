/*
Name: API - Test
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for user model
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');
var request = require('supertest');
var jwt = require('jsonwebtoken');

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
		this.timeout(2500);
		var myUser = testUsers.ford;
		request(app).post('/signup').send(myUser).expect(201).end(function(err, res) {
			assert.notOk(err);
			assert.property(res.body, "token");
			assert.ok(res.body.token);
			var tok = res.body.token;
			User.find({
				username: myUser.username
			}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, 1);
				assert.ok(res[0]);
				assert.strictEqual(res[0].email, myUser.email);
				checkToken(tok, res[0]);
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
		this.timeout(3500);
		var myUser = testUsers.arthur;
		request(app).post('/login').send({
			username: myUser.username,
			password: myUser.password
		}).expect(200).end(function(err, res) {
			assert.notOk(err);
			assert.property(res.body, "token");
			assert.ok(res.body.token);
			checkToken(res.body.token, myUser);
			request(app).post('/login').send({
				username: myUser.email,
				password: myUser.password
			}).expect(200).end(function(err, res) {
				assert.notOk(err);
				assert.property(res.body, "token");
				assert.ok(res.body.token);
				checkToken(res.body.token, myUser);
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
						request(app).post('/login').send({
							username: myUser.username,
							password: "incorrectpassword"
						}).expect(403).end(function(err, res) {
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
	it('/remove', function(done) {
		this.timeout(3000);
		var myUser = testUsers.arthur;
		var myToken;
		request(app).post('/login').send({
			username: myUser.username,
			password: myUser.password
		}).expect(200).end(function(err, res) {
			assert.notOk(err);
			assert.property(res.body, "token");
			assert.ok(res.body.token);
			myToken = res.body.token;
			checkToken(myToken, myUser);
			request(app).delete('/restricted/remove').expect(401).end(function(err, res) {
				assert.notOk(err);
				assert.ok(res.body.err);
				User.findOne({
					username: myUser.username
				}, function(err, res) {
					assert.notOk(err);
					assert.ok(res);
					assert.strictEqual(res.username, myUser.username);
					//Check stuff
					request(app).delete('/restricted/remove').set('Authorization', "Bearer " + myToken).expect(204).end(function(err, res) {
						assert.notOk(err);
						User.findOne({
							username: myUser.username
						}, function(err, res) {
							assert.notOk(err);
							assert.notOk(res);
							request(app).delete('/restricted/remove').set('Authorization', "Bearer " + myToken).expect(400).end(function(err, res) {
								assert.notOk(err);
								assert.ok(res.body.err);
								done();
							});
						});
					});
				});
			});
		});
	});

	it('/update', function(done) {
		this.timeout(2500);
		var myUser = testUsers.arthur;
		var myToken;
		request(app).post('/login').send({
			username: myUser.username,
			password: myUser.password
		}).expect(200).end(function(err, res) {
			assert.notOk(err);
			assert.property(res.body, "token");
			assert.ok(res.body.token);
			myToken = res.body.token;
			checkToken(myToken, myUser);
			request(app).put('/restricted/update').expect(401).send({
				username: "Marvin"
			}).end(function(err, res) {
				assert.notOk(err);
				assert.ok(res.body.err);
				request(app).put('/restricted/update').set('Authorization', "Bearer " + myToken).expect(204).send({
					username: "Marvin"
				}).end(function(err, res) {
					assert.notOk(err);
					User.findOne({
						username: myUser.username
					}, function(err, res) {
						assert.notOk(err);
						assert.notOk(res);
						User.findOne({
							username: "Marvin"
						}, function(err, res) {
							assert.notOk(err);
							assert.ok(res);
							assert.strictEqual(res["email"], myUser.email);
							done();
						});
					});
				});
			});
		});
	});
});

//rule for checking token
function checkToken(token, usr) {
	var decoded = jwt.decode(token);
	assert.property(decoded, "id");
	//assert.property(decoded, "username");
	if (usr["id"]) assert.strictEqual(decoded.id, usr.id);
	//assert.strictEqual(decoded.username, usr.username);
}