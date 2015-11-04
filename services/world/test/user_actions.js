/*
Name: User  Actions - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for actions
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');
//var async = require('async');

var auxFunc = require('./config/functions.js');
var data = require('./config/data.js');
//var regexp = require('../config/database.js').regexp;
var Models = require('./dbhandler.js').models;

var Actions = require('../app/user_actions.js');


describe('User Actions', function() {
	this.timeout(2000);
	
	before(function(done) {
		db = auxFunc.connectDB(function(err) {
			assert.notOk(err);
			auxFunc.clearDB(function(err) {
				assert.notOk(err);
				auxFunc.insertAllData(function(err) {
					assert.notOk(err);
					done();
				});
			});
		});
	});
	//if data is changed
	beforeEach(function(done) {
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

	it.skip("Move Ship", function() {});
	it.skip("Buy Product", function() {});
	it.skip("Sell Product", function() {});
	it.skip("Build Ship", function() {});
	it.skip("Sell Ship", function() {});
	it.skip("Repair Ship", function() {});
	it.skip("Return Ship", function() {});
});
