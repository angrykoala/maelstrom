/*
Name:Ship Model
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: 
*/
var Ship = function(name, user, shipModel) {
	this.name = name;
	this.owner = user;
	this.model = shipModel;
	this.life = shipModel.life;
	this.city = null;
	this.setStatus("DOCKED");
	this.products = [];
};
Ship.prototype.setStatus = function(status, data) {
	this.status = status;
};
Ship.prototype.getCurrentCargo = function() {

};
Ship.prototype.addProduct = function(product, quantity) {
	if ((quantity + this.getCurrentCargo()) < this.model.cargo && quantity >= 0) {
		this.products[product] = this.products[product] + quantity || quantity;
		return true;
	} else return false;
};
Ship.prototype.removeProduct = function(product, quantity) {
	if (this.products[product] >= quantity) {
		this.products[product] -= quantity;
		if (this.products[product] === 0) delete this.product[product];
	} else return false;
};
var ShipModel = function(name, data) {
	this.name = name;
	this.life = data.life || 0;
	this.speed = data.speed || 0;
	this.price = data.price || 0;
	this.cargo = data.cargo || 0;
};
ShipModel.prototype.createShip = function(name, user) {
	return new Ship(name, user, this);
};



module.exports = ShipModel;



//id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,	userId INT UNSIGNED NOT NULL, name VARCHAR(64) NOT NULL, model INT UNSIGNED NOT NULL REFERENCES ship_models(id), life INT UNSIGNED NOT NULL, status VARCHAR(64) NOT NULL, city INT UNSIGNED NOT NULL REFERENCES cities(id), destiny INT UNSIGNED REFERENCES cities(id), remaining INT UNSIGNED, FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT UNIQUE(userId,name)