module.exports = {
	url: "mongodb://localhost:27017/maelstrom_users",
	schema: {
		user: "user"
	},
	regexp: {
		user: /^[a-z0-9_-]{4,25}$/i,
		email: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/i,
		password: /^[a-z0-9_-]{8,25}$/i
	}

}