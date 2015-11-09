/*
Name: Databas Handler - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for db Handler
*/

var assert = require('chai').assert;
//var async = require('async');
var mongoose = require('mongoose');

var auxFunc = require('./config/functions.js');

var dbHandler = require('../app/dbhandler.js');
var data=require('./config/data.js');
var Models=dbHandler.models;


describe('Database Handler', function() {
	this.timeout(2000);
	var db;
	before(function(done) {
		db = auxFunc.connectDB(function(err) {
			assert.notOk(err);
			done();
		});
	});
	beforeEach(function(done){
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			auxFunc.insertAllData(function(err) {
				assert.notOk(err);
				done();
			});
		});
	});
	after(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			db.close(done);
		});
	});
	it('Models', function() {
		assert.ok(dbHandler.models);
		assert.ok(dbHandler.models.City);
		assert.ok(dbHandler.models.Product);
		assert.ok(dbHandler.models.User);
		assert.ok(dbHandler.models.Ship);
	});
	it('Get Ship', function(done) {
		var shipId;
		var userId=data.users.ohCaptainMyCaptain._id;
		assert.ok(userId);
		Models.User.find({_id:userId},function(err,res){
			assert.notOk(err);
			assert.ok(res);
			assert.ok(res[0]);
			assert.ok(res[0].ships[0]);
			shipId=res[0].ships[0]._id;
			assert.ok(shipId);
			dbHandler.getShip(userId,shipId,function(err,res){
				assert.notOk(err);
				assert.ok(res);
				assert.equal(res.id,shipId);
				assert.ok(res.name);
				assert.ok(res.model);
				dbHandler.getShip(userId,mongoose.Types.ObjectId(),function(err,res){
					assert.notOk(err);
					assert.notOk(res);
					done();
				});
			});
		});
	});
	it.skip('Update Ship', function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip('Add Ship', function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
});
