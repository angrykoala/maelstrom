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

User.prototype.buildShip = function(name, model, city, done) {
	if (this.ships[name] === undefined) {
		var ship = model.createShip(name, this, city);
		this.ships[name] = ship;
		return done(null, this.ships[name]);
	} else return done(new Error("Ship already exists"));
};
User.prototype.getAllShips = function() {
	return Object.keys(this.ships);
};

module.exports = User;