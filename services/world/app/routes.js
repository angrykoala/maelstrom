/*
Name: Routes
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: api for world interaction
*/


var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');
var bodyParser = require('body-parser');
var Get = require('./get_actions');
var config = require('../config/server');
var dbHandler = require('./dbhandler');
var defaultUser = require('../config/database').defaultUser;



module.exports = function(app) {

	app.use(bodyParser.json()); // get information from body
	app.use(bodyParser.urlencoded({
		extended: true
	}));

	//all urls under restricted can only be accesed having a jwt in the header
	//auth header must be: Bearer (jwt token)
	app.use('/user/*', expressjwt({
		secret: config.secret,
		credentialsRequired: true
	}));
	//middleware to return status 401 if jwt is not valid
	app.use(function(err, req, res, next) {
		if (err.name === 'UnauthorizedError') res.status(401).json({
			err: "invalid token"
		});
	});

	app.get('/map', function(req, response) {
		Get.map(function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});
	app.get('/ship_models', function(req, response) {
		Get.shipModels(function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});
	app.get('/user/ships', function(req, response) {
		var userId = req.user.id;
		console.log("Get ships user " + userId);
		Get.ships(userId, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});
	app.get('/user/data', function(req, response) {
		var userId = req.user.id;
		console.log("Get user data " + userId);
		Get.userData(userId, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});
	app.post('/user/signup', function(req, response) {
		//TODO: improve auth
		var userId = req.user.id;
		console.log("Create user " + userId);
		response.status(200);
		dbHandler.insert.user(userId, defaultUser, function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(201).json(res);
		});
	});
};