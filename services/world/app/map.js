/*
Name: Map
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions in  world (API) to get info
*/

var dbHandler = require('./dbhandler.js');
var table=dbHandler.tables.cities;

module.exports={
    get: function(done){
        dbHandler.get.all(tale, done);
    }
};
