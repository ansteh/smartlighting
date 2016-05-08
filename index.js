'use strict';

const express        = require('express');
const app            = express();
const path           = require('path');
const socket         = require('./server');

app.use(`/client`, express.static(path.join(__dirname, `/client`)));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const server = require('http').Server(app);

socket(server);

server.listen(3000, function(){
  console.log('listening on *:3000');
});
