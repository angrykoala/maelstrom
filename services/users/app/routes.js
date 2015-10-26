/*
Name: Routes
Project: Maelström - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: API REST for login and signup
*/

var dbHandler = require('./dbhandler');
var config = require('../config/server');
var path = require('path');
var jwt = require('jsonwebtoken');
var expressjwt = require('express-jwt');


//remove with ejs
var rootPath = {
	root: path.join(__dirname, '../views')
}

module.exports = function(app) {
	config.setup(app);
	app.get('/', function(req, res) {
		res.send("Maelstrom Users");
		console.log(req.user);
	});
	app.get('/login', function(req, res) {
		res.sendFile('login.html', rootPath);
	});
	app.post('/login', function(req, res) {
		dbHandler.findUser(req.body.username, function(err, usr) {
			if (err) {
				//console.error("POST /login: " + err);
				res.status(500).json({
					error: err.toString()
				});
			} else if (!usr) res.status(404).json({
				error: "User not found"
			});
			else {
				usr.validPassword(req.body.password, function(err, isValid) {
					if (err) {
						//console.error("POST /login: " + err);
						res.status(500).json({
							error: err.toString()
						});
					} else if (isValid) res.json({
						token: generateToken(usr)
					});
					else res.status(403).json({
						error: "Incorrect password"
					});
				});
			}
		});
	});
	app.get('/signup', function(req, res) {
		res.sendFile('./signup.html', rootPath);
	});
	app.post('/signup', function(req, res) {
		if (!req.body) res.status(400).json({
			error: "empty fohttp://localhost:8080/signuprms"
		});
		else {
			var info = {
				username: req.body["username"],
				password: req.body["password"],
				email: req.body["email"]
			};
			if (!info.username || !info.password || !info.email) res.status(400).json({
				error: "empty forms"
			});
			else dbHandler.saveUser(info, function(err, usr) {
				if (err) {
					//console.log("POST /signup"+err);
					res.status(500).json({
						error: err.toString()
					});
				} else res.status(201).json({
					token: generateToken(usr)
				});
			});
		}
	});
	/*	app.post('/logout', function(req, res) {

		});*/
	app.use('/restricted/*', expressjwt({
		secret: config.secret,
		credentialsRequired: true
	}));
	app.use(function(err, req, res, next) {
		if (err.name === 'UnauthorizedError') res.status(401).json({
			err: "invalid token"
		});

	});
	/*app.get('/restricted', function(req,res){
		//res.redirect('/restricted/dash');
	});*/
	app.delete('/restricted/remove', function(req, res) {
		dbHandler.removeUser(req.user.id, function(err) {
			if (err) res.status(400).json({
				err: err.toString()
			});
			else res.status(200).end();
		});
	});
	app.put('/restricted/update', function(req, res) {
		//TODO
	});
};

function generateToken(usr) {
	return jwt.sign({
		id: usr.id,
		username: usr.username
	}, config.secret, {
		expiresIn: config.tokenExpire
	});
}