/*
Name: City Schema
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: City mongoose schema
*/

var mongoose = require('mongoose');
var dbConfig = require('../../config/database.js'); //database configuration


var citySchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		match: [dbConfig.regexp.cityName, 'Invalid city name'],
		unique: true
	},
	distance: {
		type: [mongoose.Schema.Types.ObjectId],
		required: false,
	},
	products: [{
		product_id: mongoose.Schema.Types.ObjectId,
		production: {
			type: Number,
			required: true,
			min: 0.0
		},
		consume: {
			type: Number,
			required: true,
			min: 0.0
		},
		quantity: {
			type: Number,
			required: true,
			min: 0.0
		}
	}]
});

// create the model for product and expose it to our app
module.exports = mongoose.model(dbConfig.schema.city, citySchema);
