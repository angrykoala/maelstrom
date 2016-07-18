#!/bin/bash

pm2 start maelstrom-world --name world
pm2 start maelstrom-users --name users

cd maelstrom-web;
pm2 start app.js --name web
