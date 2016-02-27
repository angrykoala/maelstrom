/*
Name: Map
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: 
*/
var cities = {};

var map = {
	addCity: function(city) {
		if (city && city.name) {
			this.cities[city.name] = city;
		}
	},
	getCity: function(name) {
		return this.cities[name] || null;
	},
	getAllCities: function() {
		return Object.keys(this.cities);
	}
};

module.exports = map;