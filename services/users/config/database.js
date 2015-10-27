module.exports = {
	url: "mongodb://localhost:27017/maelstrom_users",
	schema: {
		user: "user"
	},
	regexp: {
		user: /^[a-z0-9_-]{4,25}$/,
		email: /^[\w-\.]+@[a-z_]+?\.[a-z]{2,3}$/,
		password: /^[a-z0-9_-]{8,25}$/i
	}

}
