//database configuration

module.exports = {
	url: "mongodb://localhost:27017/maelstrom_users", //db url
	schema: {
		user: "user_data", //name of schema to use
		product: "product",
		city: "city",
		ship: "ship"
	},
	regexp: { //regular expressions to use in database
		productName: /^[A-Z][a-z\ -]*[a-z]$/,
		cityName: /^[A-Z][A-Za-z -]*[a-z]$/,
		shipTypeName: /^[A-Z][a-z0-9\ -]*[a-z0-9]$/,
		shipName: /^[a-zA-Z][\w-\ ]{2,23}[\w]$/
	}
};