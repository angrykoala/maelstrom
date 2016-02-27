/*
Name: User
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: 
*/

var User = function(id) {
	this.id = id;
	this.ships = {};
	this.money = 0;
};

User.prototype.createShip = function(name, model) {
	if (this.ships[name] === undefined) {
		var ship = model.createShip(name, this);
		this.ships[name] = ship;
		return true;
	} else return false;
};