//Data for testing
//correct value indicates if data is correct

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
		sloop:{
			name: "Sloop",
			life: -5,
			price: 20,
			speed: 22,
			cargo: 2,
			correct: false
		}
	},
	products:{
		bread:{
			name: "Bread",
			basePrice: 50,
			baseProduction: 25.3,
			baseConsume: 30,
			weight: 1,
			correct: true
		},
		bricks:{
			name: "Bricks",
			basePrice: 20,
			baseProduction: 5.3,
			baseConsume: -2,
			weight: 2,
			correct: false
		},
		redmeat:{
			name: "Red meat",
			basePrice: 50.2,
			baseProduction: 24.3,
			baseConsume: 30.9,
			weight: 2.2,
			correct: true
		},
		salt:{
			name: "salt",
			basePrice: 100,
			baseProduction: 2.3,
			baseConsume: 3,
			weight: 1,
			correct: false
		}	
	}
}
