/*
Name: Ship Schema
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Ship type mongoose schema
*/



var mongoose = require('mongoose');
var dbConfig = require('../../config/database.js'); //database configuration


var shipSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		match: [dbConfig.regexp.shipTypeName, 'Invalid ship model name'],
		unique: true
	},
	life: {
		type: Number,
		required: true,
		min: 0.0
	},
	speed: {
		type: Number,
		required: true,
		min: 0.0
	},
	price: {
		type: Number,
		required: true,
		min: 0.0
	},
	cargo: {
		type: Number,
		required: true,
		min: 0.0
	}
	//ADD crew sometime
});


// create the model for product and expose it to our app
module.exports = mongoose.model(dbConfig.schema.ship, shipSchema);