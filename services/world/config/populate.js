//Data for database

module.exports = {
	shipModels: {
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
			name: "Beer",
			basePrice: 76,
			baseProduction: 2,
			baseConsumption: 2,
			weight: 1,
		},
		meat: {
			
			
			
			
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
	}
};
