/*
Name: Database Handler
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Handler for world database
*/


module.exports = {
	models: {
		City: require('./models/city.js'),
		Product: require('./models/product.js'),
		User: require('./models/user.js'),
		Ship: require('./models/ship.js')
	},
	getShip: function(userId, shipId, done) {
		this.models.User.findOne({_id:userId},{ships:{$elemMatch:{_id:shipId}}},function(err,res){
			done(err,res.ships[0]);
		});
	},
	updateShip: function(userId, shipId, data, done) {
		//TODO
		done(new Error('Not implemented'));
	},
	addShip: function(userId, ship, done) {
		//TODO
		done(new Error('Not implemented'));
	}
};
