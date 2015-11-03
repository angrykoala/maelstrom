/*
Name: GET Actions - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for get actions
*/

var assert = require('chai').assert;
var async = require('async');

var auxFunc = require('./config/functions.js');
var data = require('./config/data.js');
var Get = require('../app/get_actions.js');
var regexp = require('../config/database.js').regexp;


describe('Get Actions', function() {
	this.timeout(2000);
	var db;
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
	/*	beforeEach(function(done) {
			auxFunc.clearDB(function(err) {
                assert.notOk(err);
                auxFunc.insertAllData(function(err){
                    assert.notOk(err);
                    done();    
                });
			});
		});
	});*/
	after(function(done) {
		auxFunc.clearDB(function(err) {
			assert.notOk(err);
			db.close(done);
		});
	});
	it('Get Map', function(done) {
		var correctData = auxFunc.getCorrectData(data.cities);
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.ok(res);
			assert.strictEqual(correctData.length, res.length);
			for (var i = 0; i < res.length; i++) {
				assert.ok(res[i].id);
				assert.ok(res[i]._id);
				assert.ok(res[i].name);
				assert.match(res[i].name, regexp.cityName);
				assert.isNumber(res[i]["position_x"]);
				assert.isNumber(res[i]["position_y"]);
			}
			done();
		});
	});
	it('Get City details', function(done) {
		var correctData = auxFunc.getCorrectData(data.cities);
		Get.map(function(err, res) {
			assert.notOk(err);
			assert.strictEqual(res.length, correctData.length);
			async.each(res, function(city, callback) {
				Get.cityDetails(city.id, function(err, res) {
					assert.notOk(err);
					assert.ok(res.id);
					assert.ok(res.name);
					assert.match(res.name, regexp.cityName);
					assert.isNumber(res.position_y);
					assert.isNumber(res.position_x);
					assert.ok(res.products);
					for (var i = 0; i < res.products; i++) {
						assert.ok(res.products[i]);
						assert.isNumber(res.products[i].quantity);
						assert.isNumber(res.products[i].consume);
						assert.isNumber(res.products[i].production);
					}
					callback();
				});
			}, function(err) {
				assert.notOk(err);
				done();
			});
		});
	});
	it('Get User Data', function(done) {
		var correctData = auxFunc.getCorrectData(data.users);
		async.each(correctData, function(usr, callback) {
			Get.userData(usr._id, function(err, res) {
				assert.notOk(err);
				assert.ok(res);
				assert.isNumber(res.money);
				assert.ok(res.id);
				callback();
			});
		}, function(err, res) {
			assert.notOk(err);
			done();
		});
	});
	it.skip('Get User Ships', function() {});
	it.skip('Get Ship Details', function() {});
	it.skip('Get Ship Models', function() {});
	it.skip('Get products', function() {});

});