/*
Name: Users test
Project: Ma
Project: Mäelstrom - Users
Author: demiurgosoft <demiurgosoft@hotmail.com>
Description: Users to use in test
*/

//Information of users for testing
//correct value indicates if user data is correct
module.exports = {
	arthur: {
		username: "Arthur",
		email: "arthur@dent.com",
		password: "dontpanic42",
		correct: true
	},
	ford: {
		username: "ford_prefect",
		email: "fordprefect@theguide.com",
		password: "Bring_Your_Towel",
		correct: true
	},
	zaphod: {
		username: "zaphodbeeblebrox",
		email: "zaphod@mail.net",
		password: "goldenheart",
		correct: true
	},
	marvin: {
		username: "Marvin",
		email: "sadrobot",
		password: "brainlikeaplanet",
		correct: false
	},
	trillian: {
		username: "trillian",
		email: "tricia@earth.com",
		password: "tricia",
		correct: false
	},
	jeltz: {
		username: "jeltz vogon",
		email: "jeltz@vogon.com",
		password: "ProstetnicVogonJeltz",
		correct: false
	}
};