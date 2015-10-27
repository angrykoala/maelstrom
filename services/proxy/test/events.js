/*
Name: Events - Test
Project: Mäelstrom - Proxy
Author: demiurgosoft <demiurgosoft@hotmail.com>
*/

var assert = require('chai').assert;
var auxFunc=require('./config/functions.js');
var io = require('socket.io-client');
var serverConfig=require('./config/server.js');

describe('Socket Events',function(){
    before(function(done) {
		auxFunc.setupServer(done);
	});
    after(function(){
        auxFunc.closeServer();        
    });
    it.skip('Socket auth',function(){
        var socket=io("http://localhost",{port:serverConfig.port});
        socket.on('connect', function () { console.log("socket connected"); });
    });
});
