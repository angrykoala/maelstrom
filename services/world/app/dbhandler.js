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
		this.models.User.findOne({
			_id: userId
		}, {
			ships: {
				$elemMatch: {
					_id: shipId
				}
			}
		}, function(err, res) {
			done(err, res.ships[0]);
		});
	},
	updateShip: function(userId, shipId, data, done) {
		//TODO
		done(new Error('Not implemented'));
	},
	addShip: function(userId, ship, done) {
		this.models.User.findOne(userId, function(err, res) {
			if (err || !res) done(err, false);
			else {
				res.ships.push(ship);
				res.save(function(err, res) {
					if (res) done(err, true);
					else done(err, false);
				});
			}
		});

		/*this.models.User.update({
			_id: userId
		}, {
			$push: {
				ships: ship
			}
		}, function(err, res) {
			if (res.n === 1)
				done(err, true);
			else done(err, false);
		});*/
	}
};