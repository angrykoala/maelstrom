/*
Name: City
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: 
*/

var city = function(name, position) {
	if (name) this.name = name;
	if (position) this.position = [position[0], position[1]];
	this.products = [];
};

module.exports = city;