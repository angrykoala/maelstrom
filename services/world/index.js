//ONLY FOR BASIC TESTING

var app = require('express')();
require('./app/routes.js')(app); //loads routes

var world=require('./app/world');
var City=require('./app/city');
var Ship=require('./app/ship');



var c1=new City("Granada",[-2,6]);
var c2=new City("Madrid",[1,321]);
var s1=new Ship("Galleon",{life:100,speed:10,price:43,cargo:2000});
world.users.getUser("usidx",function(err,u1){
    u1.createShip("black pearl", s1);

    world.map.addCity(c1);
    world.map.addCity(c2);
    world.ships.addShip(s1);
});


app.listen(8080, function() {
    console.log("Server running");
});
