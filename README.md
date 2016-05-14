Maelström
===========
_by @demiurgosoft_

[![Build Status](https://travis-ci.org/demiurgosoft/maelstrom.svg)](https://travis-ci.org/demiurgosoft/maelstrom)
[![Coverage Status](https://coveralls.io/repos/demiurgosoft/maelstrom/badge.svg?branch=master&service=github)](https://coveralls.io/github/demiurgosoft/maelstrom?branch=master)

![Maelström Logo](https://raw.githubusercontent.com/demiurgosoft/maelstrom/master/logo/logo.jpg)

Economy and trading **MMO-RTS**(_Massively Multiplayer Online - Real Time Strategy_) simulation videogame framework under Node.js.


## Services
Maelström is composed of several which provides the features with low interdependence between them, this is a list of both, implemented and planned microservices and their current status. Each microsevice is in a different repository

|**Service**   |**Status** |**Description**                  		 |
|:------------:|:---------:|:----------------------------------------|
|[Users][users]|Finished   |Users login/signup and sessions  		 |
|[World][world]|Testing    |World server and game logic              |
|[Web][web]    |In Progress|Game web client                          |
|[Messages][messages]|Not Started|Game messaging system              |

[users]:https://github.com/demiurgosoft/maelstrom-users
[world]:https://github.com/demiurgosoft/maelstrom-world
[messages]:https://github.com/demiurgosoft/maelstrom-messages
[web]:https://github.com/demiurgosoft/maelstrom-web


## Testing
For full testing of maelström services:    
1. `npm install` will clone and install all services    
2. `npm test` will test all the services    


> Licensed under GNU AFFERO GENERAL PUBLIC LICENSE Version 3
> Maelström logo by @iblancasa under CC-by-sa
