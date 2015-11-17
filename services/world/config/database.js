//database configuration

module.exports = {
	host: 'localhost',
	user: '',
	password: '',
	database: 'maelstrom_world',
	connection_limit: 30,
	regexp: { //regular expressions to use in database
		productName: /^[A-Z][a-z\ -]*[a-z]$/,
		cityName: /^[A-Z][A-Za-z -]*[a-z]$/,
		shipTypeName: /^[A-Z][a-z0-9\ -]*[a-z0-9]$/,
		shipName: /^[a-zA-Z][\w-\ ]{2,23}[\w]$/
	},
	tables:{
		cities: "cities",
		products: "products",
		users: "users",
		shipModels: "ship_models",
		userShips: "user_ships",
		shipProduct: "ship_products",
		cityProducts: "city_products"
	}
};
