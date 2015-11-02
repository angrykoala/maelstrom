/*
Name: User Schema
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description:User mongoose schema for world service (different from user service)
*/

var mongoose = require('mongoose');
var dbConfig = require('../../config/database.js'); //database configuration
var Ship = require('./user_ship.js');

var userSchema = mongoose.Schema({
	_id: {
		type: mongoose.Schema.ObjectId,
		required: true,
		unique: true
	},
	money: {
		type: Number,
		required: true,
		min: 0.0
	},
	ships: {
		type: [Ship],
		default: []
	}
});


// create the model for product and expose it to our app
module.exports = mongoose.model(dbConfig.schema.user, userSchema);