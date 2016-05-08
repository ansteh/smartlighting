'use strict';
const socketio = require('socket.io');

const software = require('../platforms/software');

module.exports = function(server){
  const io = socketio(server);

  io.on('connection', function(socket){

    socket.on('train', function(product){
      console.log(product);
      software.trainWithLog();
      //socket.emit('missing-indeed-key');
    });

    socket.on('disconnect', function(){
      //console.log('Socket closed!');
    });
  });
};
