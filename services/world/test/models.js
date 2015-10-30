/*
Name: Models - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for world models
*/

var assert = require('chai').assert;
var mongoose = require('mongoose');

var auxFunc = require('./config/functions.js');

var City = require('../app/models/city.js');
var Product = require('../app/models/product.js');
var User = require('../app/models/user.js');
var Ship = require('../app/models/ship.js');

var testData = require('./config/data.js');

describe('Models', function() {
	this.timeout(2000);
	var db;
	before(function(done) {
		db = auxFunc.connectDB(done);
	});
	beforeEach(function(done) {
		auxFunc.clearDB(function(err) {
			if (err) done(err);
			else done();
		});
	});
	after(function(done) {
		auxFunc.clearDB(function(err) {
			if (err) done(err);
			else {
				db.close();
				done();
			}
		});
	});
	it('Ship model', function(done) {
		var testShip = new Ship(testData.ships.galleon);
		assert.ok(testShip);
		testShip.save();
		Ship.find({}, function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res.length, 1);
			var correctElements = 0;
			for (var key in testData.ships) {
				if (testData.ships.hasOwnProperty(key)) {
					if (testData.ships[key].correct === true) correctElements++;
					var newship = new Ship(testData.ships[key]);
					assert.ok(newship);
					newship.save();
				}
			}
			Ship.find({}, function(err, res) {
				assert.notOk(err);
				assert.strictEqual(res.length, correctElements);
				done();
			});
		});
	});
	it.skip('City model', function(done) {
		done();
	});
	it.skip('Product model', function(done) {
		done();
	});
	it.skip('User ship schema', function(done) {
		done();
	});
	it.skip('User model', function(done) {
		done();
	});
});