/*
Name: Product Schema
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Product mongoose schema
*/

var mongoose = require('mongoose');
var dbConfig = require('../../config/database.js'); //database configuration

var productSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		match: [dbConfig.regexp.productName, 'Invalid product name'],
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
