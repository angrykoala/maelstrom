var mongoose=require('mongoose');

var User = require('../../app/models/user.js');
var dbConfig = require('./database.js');

//auxiliary functions for testing
module.exports={
    clearUsers: function(done) {
    	User.remove({}, function(err, res) {
    		if (err) done(err);
    		else done();
    	});
    },
    connectDB: function(done){
        mongoose.connect(dbConfig.url);
		var db = mongoose.connection;
		/*db.on('error', function(err) {
			done(err);
		});*/
		db.once('open', function() {
			done();
		});
        return db;
    }   
}
