/*
Name: User Schema
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description:User mongoose schema for world service (different from user service)
*/

var mongoose = require('mongoose');
var dbConfig = require('../../config/database.js'); //database configuration


var userSchema = mongoose.Schema({
	//IMPORTANT: set id manually
	money: {
		type: Number,
		required: true,
		min: 0.0
	}
	Ships: [{
		name: {
			type: String,
			required: true,
			match: [dbConfig.regexp.shipName, 'Invalid ship name'],
			unique: true //not sure if this works
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
			id1: quantity1
		}, //TODO
		status: {
			type: String
				//"traveling,returning,docked,repairing",
		},
		travelStatus: {
			origin: mongoose.Schema.ObjectId, //required true?
			destiny: mongoose.Schema.ObjectId,
			remainingdistance {
				type: Number,
				required: true,
				min: 0.0
			}
		},
		city: {
			type: mongoose.Schema.ObjectId
				//cityID || undefined
		}
	}]

});


// create the model for product and expose it to our app
module.exports = mongoose.model(dbConfig.schema.user, userSchema);