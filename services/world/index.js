//ONLY FOR BASIC TESTING

var app = require('express')();
require('./app/routes.js')(app); //loads routes

var world=require('./app/world');
var City=require('./app/city');

var c1=new City("Granada",[-2,6]);
var c2=new City("Madrid",[1,321]);

world.map.addCity(c1);
world.map.addCity(c2);

app.listen(8080, function() {
    console.log("Server running");
});
