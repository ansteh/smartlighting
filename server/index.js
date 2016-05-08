'use strict';
const socketio = require('socket.io');

module.exports = function(server){
  const io = socketio(server);

  io.on('connection', function(socket){
    socket.on('search', function(query){
      socket.emit('missing-indeed-key');
    });

    socket.on('disconnect', function(){});
  });
};
