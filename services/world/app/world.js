/*
Name: World
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Game World, ddefining all necessary elements
*/

var User=require('./user');
var map=require('./map');

var users={
    users:{},
    getUser:function(id){
        var res=this.users[id];
        if(!res){
            this.users[id]=new User(id);
            res=this.users[id];
        }
        return res;
    }
};

var ships = {
    list:{},
	addShip: function(model) {
		if (model && model.name) {
			this.list[model.name] = model;
		}
	},
	getship: function(name) {
		return this.list[name] || null;
	},
	getshipList: function() {
		return Object.keys(this.list);
	}
};

var products = {
    list:{},
	addProduct: function(product) {
		if (product && product.name) {
			this.list[product.name] = product;
		}
	},
	getProduct: function(name) {
		return this.list[name] || null;
	},
	getProductList: function() {
		return Object.keys(this.list);
	}
};

module.exports.products=products;
module.exports.ships=ships;
module.exports.users=users;
module.exports.map=map;
