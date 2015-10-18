var test = require('tap').test,
dbhandler = require(__dirname + '/../../app/dbhandler.js');

test('loads', function (t) {
    t.ok(dbhandler, 'Loaded OK');
    t.end();
});

test('user', function (t) {
    dbHandler.saveUser({
	username: "pepe3",
	password: "wasabiwasabi",
	email: "mymail2"
    } );
    t.ok("No error","No error"); // Will not work if error
	
});
