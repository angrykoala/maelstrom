/*
Name: Product
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: 
*/
var list = {};

var products = {
	addProduct: function(product) {
		if (product && product.name) {
			this.list[product.name] = product;
		}
	},
	getProduct: function(name) {
		return this.cities[name] || null;
	},
	getProductList: function() {
		return Object.keys(this.products);
	}
};

module.exports = products;