/*
Name: City
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions related to a city
*/

var dbHandler = require('./dbhandler.js');
var tableCity=dbHandler.tables.cities;
var tableCityProducts=dbHandler.tables.cityProducts;

module.exports= {
        get: {
            byId: function(cityId,done){
                dbHandler.get.byId(tableCity, cityId, done);
            },
            //returns information of certain city
        	getDetails: function(cityId, done) {
                var getCityProducts=this.cityProducts;
        		dbHandler.get.byId(tableCity, cityId, function(err, res) {
        			if (err) return done(err, null);
        			else if (!res || res.length === 0) return done(new Error("City not found"), null);
        			var cityDetails = res[0];
        			getCityProducts(cityId, function(err, res) {
        				if (err) return done(err, cityDetails);
        				cityDetails.products = res;
        				done(null, cityDetails);
        			});
        		});
        	},
            products: function(cityId, done) {
                var query = "SELECT * FROM " + tableCity + " WHERE cityId=" + escapeString(cityId);
                runQuery(query, done);
            },
            product: function(cityId, productId, done) {
                var query = "SELECT * FROM " + tableCityProducts + " WHERE cityId=" + escapeString(cityId) + " AND productId=" + escapeString(productId);
                runQuery(query, done);
            },
    }
};
