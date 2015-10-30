//database configuration

module.exports = {
	url: "mongodb://localhost:27017/maelstrom_users", //db url
	schema: {
		user: "user_data", //name of schema to use
		product: "product"
	}
	regexp: { //regular expressions to use in database
		username: /^[a-z0-9_-]{4,25}$/,
		product: /^[A-Z][a-z\ -]*$/
	}
}
