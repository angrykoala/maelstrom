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
};

module.exports = function(app) {
	config.setup(app); //setup server

	//gets login form
	app.get('/login', function(req, res) {
		res.sendFile('login.html', rootPath);
	});
	//post login data, body must be a json with username and password at least
	//returns an user token in a json {token: mytoken}
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
	//gets signup form
	app.get('/signup', function(req, res) {
		res.sendFile('./signup.html', rootPath);
	});
	//post signup data, body mus have at least {username,password,email}
	//returns an user token inside a json {token: mytoken}
	app.post('/signup', function(req, res) {
		if (!req.body) res.status(400).json({
			error: "empty forms"
		});
		else {
			var info = {
				username: req.body.username,
				password: req.body.password,
				email: req.body.email
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

	//all urls under restricted can only be accesed having a jwt in the header
	//auth header must be: Bearer (jwt token)
	app.use('/restricted/*', expressjwt({
		secret: config.secret,
		credentialsRequired: true
	}));
	//middleware to return status 401 if jwt is not valid
	app.use(function(err, req, res, next) {
		if (err.name === 'UnauthorizedError') res.status(401).json({
			err: "invalid token"
		});
	});
	/*app.get('/restricted', function(req,res){
		//res.redirect('/restricted/dash');
	});*/
	//delete user with the jwt given (id inside jwt)
	app.delete('/restricted/remove', function(req, res) {
		dbHandler.removeUser(req.user.id, function(err) {
			if (err) res.status(400).json({
				err: err.toString()
			});
			else res.status(204).end();
		});
	});

	//update user with jwt given, changes must be in the body (similar to login or signup)
	app.put('/restricted/update', function(req, res) {
		dbHandler.updateUser(req.user.id, req.body, function(err) {
			if (err) res.status(400).json({
				err: err.toString()
			});
			else res.status(204).end();
		});
	});
};

//rule for generating users tokens
function generateToken(usr) {
	return jwt.sign({
		id: usr.id,
		username: usr.username
	}, config.secret, {
		expiresIn: config.tokenExpire
	});
}
