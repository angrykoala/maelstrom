/*
Name: Product Schema
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Product mongoose schema
*/

var mongoose = require('mongoose');


var productSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
		match: [dbConfig.regexp.product, 'Invalid username'],
		unique: true
	},
	basePrice: {
		type: Number,
		required: true,
		min: 0.0
	},
	baseProduction: {
		type: Number,
		required: true,
		min: 0.0
	},
	baseConsume: {
		type: Number,
		required: true,
		min: 0.0
	},
});

// create the model for product and expose it to our app
module.exports = mongoose.model(dbConfig.schema.product, productSchema);