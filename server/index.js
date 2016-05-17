'use strict';
const socketio = require('socket.io');

const physical = require('../platforms/physical-net');
const software = require('../platforms/software');
const services = require('../platforms/services');

const CronJob = require('cron').CronJob;

let lastBriForecast;

function appyForecastFor(product){
  return software.forecast(product)
  .then(function(result){
    result.bri = parseInt(result.bri);
    lastBriForecast = result.bri;
    return result;
  })
  .catch(console.log);
};

function updateState(){
  return new CronJob('* * * * * *', function() {
    console.log('You will see this message every second');
    physical.getLights()
    .then(function(lights){
      Object.keys(lights).forEach(function(index){
        let light = physical.getLight(index);
        light.getInfo()
        .then(function(info){
          if(info.state.reachable){
            let product = { name: info.name, index: index };
            if(info.state.bri !== lastBriForecast){
              console.log('new bri input inserted!');
              software.trainProductByState(product, { bri: info.state.bri })
              .then(function(response){
                console.log('trained by updateState:');
                physical.setBri(product.index, product.bri);
              });
            } else {
              appyForecastFor(product);
            }
          }
        });
      });
    })
    .catch(function(err){
      console.log('updateState', err);
    });
  }, null, true);
};

physical.login()
.then(function(conf){
  console.log('connected!', conf);
})
.catch(function(err){
  console.log('hue verification error', err);
});

module.exports = function(server){
  const io = socketio(server);

  updateState();

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
      appyForecastFor(product).then(function(result){
        socket.emit('forecast'+product.name, result);
      });
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

    socket.on('set-bri', function(product){
      software.trainProductByState(product, { bri: product.bri })
      .then(function(response){
        console.log('trained:', response);
        physical.setBri(product.index, product.bri);
        socket.emit('set-bri'+product.name, response);
      })
      .catch(function(err){
        console.log('failed to train bri of bulb:', product);
      });
    });

    socket.on('meetings', function(product){
      software.getTodaysMeetings(product)
      .then(function(meetings){
        //console.log(meetings);
        socket.emit('meetings'+product.name, { meetings: meetings });
      })
      .catch(function(err){
        console.log('failed to get todays meetings:', product);
      });
    });

    socket.on('disconnect', function(){
      //console.log('Socket closed!');
    });
  });
};
