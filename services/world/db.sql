-- Name: World Server Database
-- Project: Maelstrom - World
-- Author: demiurgosoft <demiurgosoft@hotmail.com>

-- CREATE DATABASE IF NOT EXISTS maelstrom_world

-- Nicely dropped
DROP TABLE IF EXISTS ship_products, city_products;
DROP TABLE IF EXISTS user_ships;
DROP TABLE IF EXISTS users,cities,products,ship_models;


-- Users, id is a mongodb ObjectID (same as in Users service database)
CREATE TABLE IF NOT EXISTS users(
id BINARY(12) PRIMARY KEY,
money INT UNSIGNED NOT NULL
);

-- Cities, position is used to calculate distances
CREATE TABLE IF NOT EXISTS cities(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(64) NOT NULL UNIQUE,
position_x INT NOT NULL,
position_y INT NOT NULL
);

-- Products
CREATE TABLE IF NOT EXISTS products(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(64) NOT NULL UNIQUE,
base_price INT UNSIGNED NOT NULL,
base_consumption INT UNSIGNED NOT NULL,
weigth INT UNSIGNED NOT NULL
);

-- Ship model, each user ship has a model
CREATE TABLE IF NOT EXISTS ship_models(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(64) NOT NULL UNIQUE,
life INT UNSIGNED NOT NULL,
speed INT UNSIGNED NOT NULL,
price INT UNSIGNED NOT NULL,
cargo INT UNSIGNED NOT NULL
);

-- User ships, each user can have multiple ships with different name
CREATE TABLE IF NOT EXISTS user_ships(
id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
user_id BINARY(12) NOT NULL,
name VARCHAR(64) NOT NULL,
model INT UNSIGNED NOT NULL REFERENCES ship_models(id),
life INT UNSIGNED NOT NULL,
FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
CONSTRAINT UNIQUE(user_id,name)
);

-- Products of a ship
CREATE TABLE IF NOT EXISTS ship_products(
ship_id INT UNSIGNED,
product_id INT UNSIGNED,
quantity INT UNSIGNED NOT NULL,
PRIMARY KEY(ship_id,product_id),
FOREIGN KEY(ship_id) REFERENCES user_ships(id) ON DELETE CASCADE,
FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Products of a city
CREATE TABLE IF NOT EXISTS city_products(
city_id INT UNSIGNED,
product_id INT UNSIGNED,
quantity INT UNSIGNED NOT NULL,
PRIMARY KEY(city_id,product_id),
FOREIGN KEY(city_id) REFERENCES cities(id) ON DELETE CASCADE,
FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);
