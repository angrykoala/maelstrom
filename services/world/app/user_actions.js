/*
Name: User Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: User actions to perform in the world (API)
*/

var dbHandler = require('./dbhandler.js');
var Models = dbHandler.models;
var Get = require('./get_actions.js');

module.exports = {
	moveShip: function(userId, shipId, toCityId, done) {
		return done(new Error("Not implemented"));
		//TODO: need database upgrade
	},
	buyProduct: function(userId, shipId, cityId, productId, quantity, done) {
		return done(new Error("Not implemented"));
		//TODO: need database upgrade
	},
	sellProduct: function(userId, shipId, cityId, productId, quantity, done) {
		done(new Error('Not implemented'));
		//TODO
	},
	buildShip: function(userId, shipModelId, cityId, shipName, done) {
		done(new Error('Not implemented'));
		//TODO
	},
	sellShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO

	},
	repairShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO
	},
	//calls ship to return from journey
	returnShip: function(userId, shipId, done) {
		done(new Error('Not implemented'));
		//TODO
	}
};