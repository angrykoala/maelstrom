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
			//todo: regexp 
	},
	basePrice: Number,
	baseProduction: Number,
	baseConsume: Number,
});

// create the model for product and expose it to our app
module.exports = mongoose.model(dbConfig.schema.product, productSchema);