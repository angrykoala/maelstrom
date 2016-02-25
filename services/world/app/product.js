/*
Name: Product
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions related to products
*/

var dbHandler = require('./dbhandler.js');
var tables=dbHandler.tables;

module.exports={
    get:{
        all: function(done) {
    		dbHandler.get.all(tables.products, done);
    	},
    	details: function(productId, done) {
    		dbHandler.get.byId(tables.products, productId, function(err, res) {
    			if (err) return done(err, res);
    			else if (!res || res.length === 0) return done(new Error("Product not found"), null);
    			else return done(null, res[0]);
    		});
    	}
    /*    sellingPrice: function(cityId, productId, quantity, done) {    
            dbHandler.get.cityProduct(cityId, productId, function(err, res) {
                if (err) return done(err);
                if (!res || res.length === 0) return done(new Error("Not city-product found"));
                var prod = res[0].production;
                var cons = res[0].consumption;
                var cityq = res[0].quantity;
                dbHandler.get.byId(tables.products, productId, function(err, res) {
                    if (err) return done(err);
                    if (!res || res.length === 0) return done(new Error("Not product found"));
                    var price = gameLogic.sellingPrice(cityq, prod, cons, res[0].basePrice, quantity);
                    return done(null, price);
                });
            });
        },
        buyingPrice: function(cityId, productId, quantity, done) {
            dbHandler.get.cityProduct(cityId, productId, function(err, res) {
                if (err) return done(err);
                if (!res || res.length === 0) return done(new Error("Not city-product found"));
                var prod = res[0].production;
                var cons = res[0].consumption;
                var cityq = res[0].quantity;
                dbHandler.get.byId(tables.products, productId, function(err, res) {
                    if (err) return done(err);
                    if (!res || res.length === 0) return done(new Error("Not product found"));
                    var price = gameLogic.buyingPrice(cityq, prod, cons, res[0].basePrice, quantity);
                    return done(null, price);
                });
            });
        }   */
    }    
};
