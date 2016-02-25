/*
Name: Ship
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions related to ships
*/

var dbHandler = require('./dbhandler.js');
var tables=dbHandler.tables;

module.exports={
    get:{
        byId: function(shipId,done){
            var query = "SELECT * FROM " + tables.userShips + " WHERE id=" + escapeString(shipId);
            runQuery(query, done);            
        },
        //returns all userId ships basic info 
        userShips: function(userId, done) {
            var query = "SELECT * FROM " + tables-userShips + " WHERE userId=" + escapeString(userId);
            runQuery(query, done);
        },
        shipProducts: function(shipId, done) {
            var query = "SELECT * FROM " + tables.shipProducts + " WHERE shipId=" + escapeString(shipId);
            runQuery(query, done);
        },
        //returns details of a certain ship
        shipDetails: function(shipId, done) {
            var getShip=this.byId;
            var getShipProducts=this.shipProducts;
            getShip(shipId, function(err, res) {
                if (err || !res[0]) return done(err, null);
                var shipDetails = res[0];
                getShipProducts(shipId, function(err, res) {
                    if (err || !res) return done(err, shipDetails);
                    for (var i = 0; i < res.length; i++) delete res[i].shipId;
                    shipDetails.products = res;
                    done(null, shipDetails);
                });
            });
        },
        //return all ships models
        shipModels: function(done) {
            dbHandler.get.all(tables.shipModels, done);
        },
        shipModel: function(modelId, done) {
            dbHandler.get.byId(tables.shipModels, modelId, function(err, res) {
                if (err) return done(err, res);
                else if (!res || res.length === 0) return done(new Error("Model not found"), null);
                else return done(null, res[0]);
            });
        },    
    }
};
