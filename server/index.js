'use strict';
const socketio = require('socket.io');

const software = require('../platforms/software');

module.exports = function(server){
  const io = socketio(server);

  io.on('connection', function(socket){

    socket.on('train', function(product){
      let network = software.train(product);
      socket.emit('trained', network.toJSON());
    });

    socket.on('forecast', function(product){
      socket.emit('forecast', software.forecast(product));
    });

    socket.on('day-forecast', function(product){
      socket.emit('day-forecast', software.getDayForecastOf(product));
    });

    socket.on('disconnect', function(){
      //console.log('Socket closed!');
    });
  });
};
