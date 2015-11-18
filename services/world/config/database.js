//database configuration

module.exports = {
	connection: {
		client: 'mysql',
		connection: {
			host: '127.0.0.1',
			user: '',
			password: '',
			database: 'maelstrom_world'
		},
		pool: {
			min: 2,
			max: 10
		}
	},
	regexp: { //regular expressions to use in database
		productName: /^[A-Z][a-z\ -]*[a-z]$/,
		cityName: /^[A-Z][A-Za-z -]*[a-z]$/,
		shipTypeName: /^[A-Z][a-z0-9\ -]*[a-z0-9]$/,
		shipName: /^[a-zA-Z][\w-\ ]{2,23}[\w]$/
	},
	tables: {
		cities: "cities",
		products: "products",
		users: "users",
		shipModels: "ship_models",
		userShips: "user_ships",
		shipProducts: "ship_products",
		cityProducts: "city_products"
	}
};
