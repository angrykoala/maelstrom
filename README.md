Maelström
===========
_by @demiurgosoft_

_Version: 0.1.2_

[![Build Status](https://travis-ci.org/demiurgosoft/maelstrom.svg)](https://travis-ci.org/demiurgosoft/maelstrom)
[![Coverage Status](https://coveralls.io/repos/demiurgosoft/maelstrom/badge.svg?branch=master&service=github)](https://coveralls.io/github/demiurgosoft/maelstrom?branch=master)
[![Dependency Status](https://gemnasium.com/demiurgosoft/maelstrom.svg)](https://gemnasium.com/demiurgosoft/maelstrom)
[![Code Climate](https://codeclimate.com/github/demiurgosoft/maelstrom/badges/gpa.svg)](https://codeclimate.com/github/demiurgosoft/maelstrom)

Economy and trading **MMO-RTS**(_Massively Multiplayer Online - Real Time Strategy_) simulation videogame framework under Node.js. 

## Requirements
Maelström will need the following software installed to work (may vary for each service)
* **Node.js** 0.10 or newer
* **MongoDB** 2.6.3 or newer
* **MySql** 5.6 or newer
* **Npm**
* **RabbitMQ**



## Getting started
Each service can be deployed and tested separately, however, you can simple run the following commands on top folder, which will affect to all services:
* `npm install` will install all the dependencies for each service
    * `npm install --production` will only install production dependencies (not dev dependencies, note that dev-dependencies are necessary to execute the tests)
* `npm test` will test every service with mocha and generate coverage info
    * `npm run coverall` is used by travis-ci and coverall
* `npm clean` will clean all services and root folders, this will remove all backup files, unnecessary folders and **all** dependencies 


## Services
Maelström is composed of several [_microservices_](https://github.com/demiurgosoft/maelstrom/tree/master/services) which provides the features with low interdependence between them, this is a list of both, implemented and planned microservices and their current status

|**Service** |**Status** |**Version**|**Description**                  			|
|:----------:|:---------:|:---------:|:-----------------------------------------|
|Users		 |Working	 |0.1.4  	 |Users login/signup and sessions  			|
|Proxy		 |In progress|0.0.4		 |Client conection with system with sockets	|
|World       |In progress|0.1.3      |World server and game logic              |

> Licensed under GNU AFFERO GENERAL PUBLIC LICENSE Version 3
