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
	}
}