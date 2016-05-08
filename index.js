'use strict';

const express        = require('express');
const app            = express();
const path           = require('path');
const fs             = require('fs');

app.use(`/client`, express.static(path.join(__dirname, `/client`)));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const server = require('http').Server(app);
server.listen(3000, function(){
  console.log('listening on *:3000');
});
