/*
Name: Routes
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: api for world interaction
*/


var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var bodyParser = require('body-parser');

var City = require('./city');
var User = require('./user');
var Product = require('./product');
var ShipModel = require('./ship');
var World = require('./world');


module.exports = function(app) {

	app.use(bodyParser.json());

	//all urls under user can only be accesed having a jwt in the header
	//auth header must be: Bearer (jwt token)
	app.use('/user/*', expressjwt({
		secret: "dontpanic",
		credentialsRequired: true
	}));
	//middleware to return status 401 if jwt is not valid
	app.use(function(err, req, res, next) {
		if (err.name === 'UnauthorizedError') res.status(401).json({
			err: "invalid token"
		});
	});

	app.get('/map', function(req, response) {
		World.map.getAllCities(function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});
	app.get('/city/:city_name', function(req, response) {
		var cityName = req.params.city_name;
		World.map.getCity(cityName, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});
	app.get('/ship_models', function(req, response) {
		World.ships.getShipList(function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});
	app.get('/user/ships', function(req, response) {
		var userId = req.user.id;
		World.users.getUser(userId, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res.getAllShips());
		});
	});
	app.get('/user/data', function(req, response) {
		var userId = req.user.id;
		World.users.getUser(userId, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else {
				var resp = {
					"id": res.id,
					"money": res.money
				};
				return response.status(200).json(resp);
			}
		});
	});
	app.post('/user/signup', function(req, response) {
		var userId = req.user.id;
		console.log("Create user " + userId);
		World.users.addUser(userId, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else {
				return response.status(201).json(res);
			}
		});
	});
	app.put('/user/build/ship', function(req, response) {
		//TODO: set money
		var userId = req.user.id;
		var shipModelId = req.body.model;
		var shipName = req.body.ship_name;
		var cityId = req.body.city; //USE THIS TOO!
		console.log("Build ship " + userId);
		if (shipModelId === undefined || !shipName || cityId === undefined || !userId) return response.status(500).json({
			error: "Not valid data"
		});
		World.users.getUser(userId, function(err, user) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else {
				var model = World.ships.getShip(shipModelId);
				if (!model) return response.status(500).json({
					error: "No shipModel found"
				});
				if (!World.map.isCity(cityId)) return response.status(500).json({
					error: "City doesn't exist"
				});
				user.buildShip(shipName, model, cityId, function(err, res) {
					if (err) return response.status(500).json({
						error: err.toString()
					});
					else return response.status(201).json(res);
				});
			}
		});
	});
	app.put('/user/move/ship', function(req, response) {
		var userId = req.user.id;
		var shipId = req.body.ship;
		var cityId = req.body.city;
		console.log("Move ship " + userId);
		if (shipModelId === undefined || shipId === undefined || cityId === undefined) return response.status(500).json({
			error: "Not valid data"
		});
		Actions.moveShip(userId, shipId, cityId, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else if (!res) return response.status(500).json({
				error: "Can't move ship"
			});
			else return response.status(201).json(res);
		});
	});
	/*app.put('/user/buy',function(req,response){
			var userId=req.user.id;
			var shipId=req.body.ship;
			var productId=req.body.product;
			var quantity=req.body.quantity;
			console.log("Buy Product "+userId);
			if (shipId === undefined || userId===undefined || productId === undefined || quantity===undefined) return response.status(500).json({
				error: "Not valid data"
			});
			Actions.buyProduct(userId, shipId, productId, quantity,function(err,res){
				if (err) return response.status(500).json({
					error: err.toString()
				});
				else if(!res) return response.status(500).json({error: "Can't buy product"});
				else return response.status(201).json(res);
			});
		});*/
};
