'use strict';
const socketio = require('socket.io');

const physical = require('../platforms/physical-net');
const software = require('../platforms/software');

physical.login()
.then(function(){
  console.log('connected!');
})
.catch(function(err){
  console.log('login error', err);
});

module.exports = function(server){
  const io = socketio(server);

  io.on('connection', function(socket){

    physical.getLights()
    .then(function(lights){
      //console.log(lights);
      //physical.getLightByIndex(2).on();
      console.log(Object.keys(lights) + "lights found!");
      socket.emit('lights', lights);
    })
    .catch(function(err){
      console.log(err);
      socket.emit('lights');
    });

    socket.on('train', function(product){
      let network = software.train(product);
      socket.emit('trained', network.toJSON());
    });

    socket.on('forecast', function(product){
      console.log(product);
      socket.emit('forecast'+product.name, software.forecast(product));
    });

    socket.on('day-forecast', function(product){
      socket.emit('day-forecast'+product.name, software.getDayForecastOf(product));
    });

    socket.on('switch', function(product){
      physical.switchLight(product.index)
      .then(function(){
        socket.emit('switched'+product.name);
      })
      .catch(function(){
        console.log('failed to switch bulb:', product);
      });
    });

    socket.on('disconnect', function(){
      //console.log('Socket closed!');
    });
  });
};
