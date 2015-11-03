/*
Name: GET Actions
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions in  world (API) to get info
*/

var Models = require('./dbhandler.js').models;

//Maybe use some enum to handle the level of info to get
module.exports = {
	//returns all the map basic information
	map: function(done) {
		Models.City.find({}, 'id name position_x position_y', done);
	},
	//returns full imformation of certain city
	cityDetails: function(cityId, done) {
		Models.City.findOne({
			_id: cityId
		}, function(err, res) {
			done(err, res);
		});
	},
	//returns all user data (money)
	userData: function(userId, done) {
		Models.User.findOne({
			_id: userId
		}, 'money', function(err, res) {
			done(err, res);
		});
	},
	//returns all userId ships basic info 
	ships: function(userId, done) {
		Models.User.findOne({
			_id: userId
		}, 'ships._id ships.name ships.model ships.status ships.travelStatus ships.life', function(err, res) {
			done(err, res["ships"]);
		});
	},
	//returns details of a certain ship
	shipDetails: function(userId, shipId, done) {
		Models.User.findOne({
			_id: userId,
			'ships._id': shipId //check with ships: shipId
		}, 'ships', function(err,res){
            done(err,res["ships"][0]);
        }); //maybe ships.* doesnt work
	},
	//return all ships models
	shipModels: function(done) {
		Models.Ship.find({}, done);
	},
	products: function(cityId, done) {

	}
}
