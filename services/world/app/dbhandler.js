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
			if (!res) done(err, null);
			else if (!res.ships) done(err, null);
			else done(err, res.ships[0]);
		});
	},
	/*updateShip: function(userId, shipId, changes, done) {
		this.models.User.update({_id: userId,'ships._id':shipId},{$set:{'ships.$.'+key:value}},function(err,res){
			if(res.nModified===1) done(err,true);
			else done(err,false);	
		});
	},*/
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
	},
	getCityProduct: function(cityId,productId,done){
		this.models.City.findOne({
			_id: cityId
		}, {
			products: {
				$elemMatch: {
					_id: productId
				}
			}
		}, function(err, res) {
			if (!res) done(err, null);
			else if (!res.products) done(err, null);
			else done(err, res.products[0]);
		});
		
	}
};
