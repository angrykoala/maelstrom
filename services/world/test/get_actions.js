/*
Name: GET Actions - Test
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Unit test for get actions
*/

var assert = require('chai').assert;
var auxFunc = require('./config/functions.js');
var data = require('./config/data.js');
var Get = require('../app/get_actions.js');


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
				assert.isNumber(res[i]["position_x"]);
				assert.isNumber(res[i]["position_y"]);
			}
			done();
		});
	});
	it.skip('Get City', function(done) {



	});
	it.skip('Get User Data', function() {});
	it.skip('Get User Ships', function() {});
	it.skip('Get Ship Details', function() {});
	it.skip('Get Ship Models', function() {});
	it.skip('Get products', function() {});

});
