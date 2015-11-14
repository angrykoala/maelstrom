//database configuration

module.exports = {
	url: "mongodb://localhost:27017/maelstrom_users", //db url
	schema: {
		user: "user" //name of schema to use
	},
	regexp: { //regular expressions to use in database
		username: /^[a-z0-9_-]{4,25}$/,
		email: /^[\w-\.]+@[a-z_]+(\.[a-z]{2,3})+$/,
		//	password: /^[a-z0-9_-]{8,25}$/i
		password: /^[\w@#$*?¿\\\/\^\|':;,.\-%&(){}¡!~]{8,25}$/
	}
};
