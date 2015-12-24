//Data for testing
//correct value indicates if data is correct
//var mongoose = require('mongoose');

module.exports = {
	ships: {
		galleon: {
			name: "Galleon",
			life: 1000,
			price: 12,
			speed: 4.5,
			cargo: 1200,
			correct: true
		},
		caravel: {
			name: "caravel",
			price: 100,
			speed: 8,
			cargo: 400,
			correct: false
		}
	},
	products: {
		bread: {
			name: "Bread",
			basePrice: 50,
			weight: 1,
			correct: true
		},
		redmeat: {
			name: "Red meat",
			basePrice: 50.2,
			weight: 2.2,
			correct: true
		},
		stone: {
			name: "Stone",
			basePrice: 10.2,
			weight: 20.2,
			correct: true
		},
		salt: {
			basePrice: 100,
			weight: 1,
			correct: false
		},
		gold: {
			name: "Gold",
			weight: 1,
			correct: false
		}
	},
	cities: {
		minasTirith: {
			name: "Minas Tirith",
			positionX: 10,
			positionY: 40,
			correct: true
		},
		isengard: {
			name: "Isengard",
			positionX: -5,
			positionY: -259.5,
			correct: true
		},
		rohan: {
			name: "Rohan",
			positionX: 0,
			positionY: 0,
			correct: true
		},
		rivendel: {
			positionX: -5,
			positionY: -259.5,
			correct: false
		}
	},
	userShips: {
		blackPearl: {
			name: "Black Pearl",
			model: 1,
			life: 110,
			status: "docked",
			correct: true
		},
		whitePearl: {
			name: "White Pearl",
			model: 1,
			life: 110,
			status: "docked",
			correct: true
		},
		flyingdutchman: {
			name: "flying_dutchman",
			life: 100,
			status: "traveling",
			correct: false
		}
	},
	users: {
		arthur: {
			id: 1,
			money: 101,
			correct: true
		},
		ford: {
			id: 2,
			money: 12000,
			correct: true
		},
		marvin: {
			id: 4,
			correct: false
		},
		deepthinking: {
			money: 150,
			correct: false
		}
	}
};