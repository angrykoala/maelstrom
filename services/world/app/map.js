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
			cities[city.name] = city;
		}
	},
	getCity: function(name, done) {
		var c = cities[name];
		if (!c) return done(new Error("No city found"));
		return done(null, c);
	},
	getAllCities: function(done) {
		return done(null, Object.keys(cities));
	}
};

module.exports = map;