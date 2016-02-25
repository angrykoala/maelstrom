/*
Name: User
Project: Maelström - World
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Actions related to a certain user
*/

var dbHandler = require('./dbhandler.js');
var tableUsers=dbHandler.tables.users;

module.exports= {
    get:{
        //returns all user data (money)
    	data: function(userId, done) {
    		dbHandler.get.byId(tablesUsers, userId, function(err, res) {
    			if (err) return done(err, null);
    			else if (!res || res.length === 0) return done(new Error("User not found"), null);
    			else return done(null, res[0]);
    		});
    	}
    },
    insert: {
		user: function(userId, userData, done) {
			if (userId === undefined || !userData || userData.money === undefined) return done(new Error("Not user data"));
			var query = "INSERT INTO " + tableUsers + " (id,money) VALUES (" + escapeString(userId) + "," + escapeString(userData.money) + ")";
			runQuery(query, function(err, res) {
				if (err || !res) return done(err);
				else return done(null, userId);
			});
		}
    }
};
