/*
Name: Databas Handler - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for db Handler
*/

var assert = require('chai').assert;
//var async = require('async');
//var mongoose = require('mongoose');

var auxFunc = require('./config/functions.js');

var dbHandler = require('../app/dbhandler.js');


describe('Database Handler', function() {
	this.timeout(2000);

	it('Models', function() {
		assert.ok(dbHandler.models);
		assert.ok(dbHandler.models.City);
		assert.ok(dbHandler.models.Product);
		assert.ok(dbHandler.models.User);
		assert.ok(dbHandler.models.Ship);
	});
	it.skip('Get Ship', function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip('Update Ship', function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip('Add Ship', function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
	it.skip('Get Ship', function(done) {
		done(new Error('Not implemented'));
		//TODO
	});
});
