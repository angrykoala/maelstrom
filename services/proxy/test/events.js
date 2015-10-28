/*
Name: Events - Test
Project: Mäelstrom - Proxy
Author: demiurgosoft <demiurgosoft@hotmail.com>
*/

var assert = require('chai').assert;
var auxFunc = require('./config/functions.js');
var io = require('socket.io-client');
var serverConfig = require('./config/server.js');

describe('Socket Events', function() {
	this.timeout(4000);
	before(function(done) {
		auxFunc.setupServer(done);
	});
	after(function() {
		auxFunc.closeServer();
	});
	it('Socket auth', function(done) {
		var token = auxFunc.generateToken({
			id: "777777",
			username: "arthurdent"
		});
		var token2 = auxFunc.generateToken({
			id: "444444",
			username: "fordprefect"
		}, "othersecret");
		var socket = io("http://localhost:" + serverConfig.port, {
			query: 'token=' + token,
			forceNew: true
		});
		var socket2 = io("http://localhost:" + serverConfig.port, {
			forceNew: true
		});
		var socket3 = io("http://localhost:" + serverConfig.port, {
			query: 'token=' + token2,
			forceNew: true
		});
		socket.on('connect', function() {
			setTimeout(function() {
				assert.strictEqual(socket.connected, true);
				assert.strictEqual(socket2.connected, false);
				assert.strictEqual(socket3.connected, false);
				done();
			}, 500);
		});
	});
});