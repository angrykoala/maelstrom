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
			life: 200,
			price: 100,
			speed: 8,
			cargo: 400,
			correct: false
		},
		lineship: {
			name: "Ship of the line",
			life: 3000,
			price: 3100,
			speed: 3,
			cargo: 0,
			correct: true
		},
		sloop: {
			name: "Sloop",
			life: -5,
			price: 20,
			speed: 22,
			cargo: 2,
			correct: false
		},
		space: {
			name: "Space Ship ",
			life: 100,
			price: 200,
			speed: 4.5,
			cargo: 200,
			correct: false
		}
	},
	products: {
		bread: {
			name: "Bread",
			basePrice: 50,
			baseProduction: 25.3,
			baseConsume: 30,
			weight: 1,
			correct: true
		},
		bricks: {
			name: "Bricks",
			basePrice: 20,
			baseProduction: 5.3,
			baseConsume: -2,
			weight: 2,
			correct: false
		},
		redmeat: {
			name: "Red meat",
			basePrice: 50.2,
			baseProduction: 24.3,
			baseConsume: 30.9,
			weight: 2.2,
			correct: true
		},
		salt: {
			name: "salt",
			basePrice: 100,
			baseProduction: 2.3,
			baseConsume: 3,
			weight: 1,
			correct: false
		}
	},
	cities: {
		minasTirith: {
			name: "Minas Tirith",
			position_x: 10,
			position_y: 40,
			products: [{
				id: mongoose.Types.ObjectId(),
				production: 60,
				consume: 120,
				quantity: 589
			}, {
				id: mongoose.Types.ObjectId(),
				production: 40,
				consume: 20,
				quantity: 80
			}],
			correct: true
		},
		isengard: {
			name: "Isengard",
			position_x: -5,
			position_y: -259.5,
			products: [],
			correct: true
		},
		rivendel: {
			name: "rivendel",
			position_x: -5,
			position_y: -259.5,
			products: [],
			correct: false
		},
		vale: {
			name: "Vale ",
			position_x: -5,
			position_y: -259.5,
			products: [{
				id: mongoose.Types.ObjectId(),
				production: 60,
				consume: 120,
				quantity: 589
			}],
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
			_id: mongoose.Types.ObjectId(),
			money: 100,
			ships: [{
				name: "Black Pearl",
				model: mongoose.Types.ObjectId(),
				life: 110,
				speed: 35,
				products: [{
					id: mongoose.Types.ObjectId(),
					quantity: 10
				}],
				city: mongoose.Types.ObjectId()
			}],
			correct: true
		},
		ford: {
			_id: mongoose.Types.ObjectId(),
			money: 120,
			ships: [{
				name: "Black Pearl",
				model: mongoose.Types.ObjectId(),
				life: 110,
				speed: 35,
				products: [],
				city: mongoose.Types.ObjectId()
			}],
			correct: true
		},
		captainCrunch: {
			_id: mongoose.Types.ObjectId(),
			money: 0,
			correct: true
		},
		blackBeard: {
			_id: mongoose.Types.ObjectId(),
			money: -20,
			correct: false
		},
		whiteBeard: {
			id: mongoose.Types.ObjectId(),
			money: 20,
			correct: false
		},
		strawHat: {
			money: 20,
			correct: false
		},
		thecaptain: {
			_id: mongoose.Types.ObjectId(),
			money: 1000,
			ships: [{
				name: "My Boat", //no life (required)
				model: mongoose.Types.ObjectId(),
				speed: 35,
				products: [],
				city: mongoose.Types.ObjectId()
			}],
			correct: false
		}
	}
};