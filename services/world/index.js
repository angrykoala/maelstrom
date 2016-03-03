//ONLY FOR BASIC TESTING

var app = require('express')();
require('./app/routes.js')(app); //loads routes

var world = require('./app/world');
var City = require('./app/city');
var Ship = require('./app/ship');


//token for testing: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE0NTcwMjI5OTcsImV4cCI6MTQ4ODU1ODk5NywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsImlkIjoidXNpZHgifQ.TXLzue_OcnPF4Jh0lDDYGWQWUtzWTvxqRgnM5P2GdZ4
var c1 = new City("Granada", [-2, 6]);
var c2 = new City("Madrid", [1, 321]);
var s1 = new Ship("Galleon", {
	life: 100,
	speed: 10,
	price: 43,
	cargo: 2000
});
world.users.addUser("usidx", function(err, u1) {
	u1.buildShip("black pearl", s1,function(){

	world.map.addCity(c1);
	world.map.addCity(c2);
	world.ships.addShip(s1);
});
});


app.listen(8080, function() {
	console.log("Server running");
});
