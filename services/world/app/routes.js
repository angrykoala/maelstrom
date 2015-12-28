/*
Name: Routes
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: api for world interaction
*/


//var jwt = require('jsonwebtoken');
//var expressjwt = require('express-jwt
var Get = require('./get_actions');

module.exports = function(app) {

	app.get('/map', function(req, response) {
		Get.map(function(err, res) {
			if (err) return response.status(500).json({
				error: err.toString()
			});
			else return response.status(200).json(res);
		});
	});


};