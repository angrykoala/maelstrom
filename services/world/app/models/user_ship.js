/*
Name: UserShip Schema
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Ship mongoose subschema for users
*/

var mongoose = require('mongoose');
var dbConfig = require('../../config/database.js'); //database configuration

module.exports = mongoose.Schema({
	name: {
		type: String,
		required: true,
		match: [dbConfig.regexp.shipName, 'Invalid ship name'],
		//	unique: true
	},
	model: {
		type: mongoose.Schema.ObjectId,
		required: true
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
	products: {
		type: [{
			id: {
				type: mongoose.Schema.ObjectId,
				required: true
			},
			quantity: {
				type: Number,
				required: true,
				min: 0.0
			}
		}],
		default: []
	},
	status: {
		type: String,
		//required: true,
		enum: ["traveling", "returning", "docked", "repairing"],
		default: "docked"
	},
	travelStatus: {
		origin: {
			type: mongoose.Schema.ObjectId,
			//	required: true
		},
		destiny: {
			type: mongoose.Schema.ObjectId,
			//	required: true
		},
		remaining: {
			type: Number,
			//	required: true,
			min: 0.0
		}
	},
	city: mongoose.Schema.ObjectId //cityID || undefined
});