module.exports = {
	cities: "id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, name VARCHAR(64) NOT NULL UNIQUE, position_x INT NOT NULL, position_y INT NOT NULL",

	products: "id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, name VARCHAR(64) NOT NULL UNIQUE, base_price FLOAT UNSIGNED NOT NULL, base_production FLOAT UNSIGNED NOT NULL, base_consumption FLOAT UNSIGNED NOT NULL, weight FLOAT UNSIGNED NOT NULL",

	users: "id INT UNSIGNED PRIMARY KEY, money INT UNSIGNED NOT NULL",

	shipModels: "id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, name VARCHAR(64) NOT NULL UNIQUE, life INT UNSIGNED NOT NULL, speed FLOAT UNSIGNED NOT NULL, price INT UNSIGNED NOT NULL, cargo INT UNSIGNED NOT NULL",

	userShips: "id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, user_id INT UNSIGNED NOT NULL, name VARCHAR(64) NOT NULL, model INT UNSIGNED NOT NULL REFERENCES ship_models(id), life INT UNSIGNED NOT NULL, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE, CONSTRAINT UNIQUE(user_id,name)",

	shipProducts: "ship_id INT UNSIGNED, product_id INT UNSIGNED, quantity INT UNSIGNED NOT NULL, PRIMARY KEY(ship_id,product_id), FOREIGN KEY(ship_id) REFERENCES user_ships(id) ON DELETE CASCADE, FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE",

	cityProducts: "city_id INT UNSIGNED, product_id INT UNSIGNED, quantity INT UNSIGNED NOT NULL, PRIMARY KEY(city_id,product_id), FOREIGN KEY(city_id) REFERENCES cities(id) ON DELETE CASCADE, FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE"
};
