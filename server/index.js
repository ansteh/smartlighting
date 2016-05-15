'use strict';
const socketio = require('socket.io');

const physical = require('../platforms/physical-net');
const software = require('../platforms/software');
const services = require('../platforms/services');

//software.trainProductByState({ name: 'Bulb 1'}, { bri: 195 });

physical.login()
.then(function(conf){
  console.log('connected!', conf);
})
.catch(function(err){
  console.log('hue verification error', err);
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
      software.forecast(product)
      .then(function(result){
        //console.log(result);
        socket.emit('forecast'+product.name, result);
      })
      .catch(console.log);
    });

    socket.on('day-forecast', function(product){
      software.getDayForecastOf(product)
      .then(function(result){
        //console.log(result);
        socket.emit('day-forecast'+product.name, result);
      })
      .catch(console.log);
    });

    socket.on('switch', function(product){
      physical.switchLight(product.index)
      .then(function(state){
        socket.emit('switch'+product.name, state);
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
