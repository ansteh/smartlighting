'use strict';
const socketio = require('socket.io');

const physical = require('../platforms/physical-net');
const software = require('../platforms/software');

physical.login()
.then(function(){
  console.log('connected!');
});

module.exports = function(server){
  const io = socketio(server);

  io.on('connection', function(socket){

    physical.getLights()
    .then(function(lights){
      //console.log(lights);
      console.log(Object.keys(lights) + "lights found!");
      socket.emit('lights', lights);
    });

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
