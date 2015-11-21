//Data for testing
//correct value indicates if data is correct
var mongoose = require('mongoose');

module.exports = {
	ships: {
		galleon: {
			name: "Galleon",
			life: 1000,
			price: 1200,
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
			baseProduction: 25.3,
			baseConsumption: 30,
			weight: 1,
			correct: true
		},
		redmeat: {
			name: "Red meat",
			basePrice: 50.2,
			baseProduction: 24.3,
			baseConsumption: 30.9,
			weight: 2.2,
			correct: true
		},
		salt: {
			basePrice: 100,
			baseProduction: 2.3,
			baseConsumption: 3,
			weight: 1,
			correct: false
		},
		gold: {
			name: "Gold",
			baseProduction: 2.3,
			baseConsumption: 3,
			weight: 1,
			correct: false
		}
	},
	cities: {
		minasTirith: {
			name: "Minas Tirith",
			position_x: 10,
			position_y: 40,
			correct: true
		},
		isengard: {
			name: "Isengard",
			position_x: -5,
			position_y: -259.5,
			correct: true
		},
		rivendel: {
			position_x: -5,
			position_y: -259.5,
			correct: false
		}
	},
	userShips: {
		blackPearl: {
			name: "Black Pearl",
			model: mongoose.Types.ObjectId(),
			life: 110,
			speed: 35,
			products: [],
			city: mongoose.Types.ObjectId(),
			correct: true
		},
		flyingdutchman: {
			name: "flying_dutchman",
			model: mongoose.Types.ObjectId(),
			life: 100,
			speed: 25,
			products: [{
				id: mongoose.Types.ObjectId(),
				quantity: 10
			}],
			status: "traveling",
			travelStatus: {
				origin: mongoose.Types.ObjectId(),
				destiny: mongoose.Types.ObjectId(),
				remaining: 10
			},
			correct: true
		},
		goingMerry: {
			name: "goingmerry",
			model: mongoose.Types.ObjectId(),
			life: 100,
			speed: 25,
			products: [{
				id: mongoose.Types.ObjectId(),
				quantity: 0
			}],
			status: "flying",
			travelStatus: {
				origin: mongoose.Types.ObjectId(),
				destiny: mongoose.Types.ObjectId(),
				remaining: 10
			},
			correct: false
		},
		olimpic: {
			name: "Olimpic ",
			model: mongoose.Types.ObjectId(),
			life: 110,
			speed: 35,
			products: [],
			city: mongoose.Types.ObjectId(),
			correct: false
		},
		roger: {
			name: "Roger",
			model: mongoose.Types.ObjectId(),
			life: 110,
			speed: 35,
			products: [{
				id: mongoose.Types.ObjectId()
			}],
			city: mongoose.Types.ObjectId(),
			correct: false
		},
		davy: {
			name: "Davy Jones",
			life: 110,
			speed: 35,
			city: mongoose.Types.ObjectId(),
			correct: false
		}
	},
	users: {
		arthur: {
			id: 1,
			money: 100,
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
