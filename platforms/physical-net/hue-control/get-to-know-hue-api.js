'use strict';
const path = require('path');
var CronJob = require('cron').CronJob;



var Hue = require('philips-hue');
var hue = new Hue();

//hue.light(1).on();

/*hue.getLights()
  .then(function(lights){
    console.log(lights);
    console.log(Object.keys(lights) + " lights found!");
  })
  .catch(function(err){
    console.error(err.stack || err);
  });*/

function random(limit){
  return function(){
    return Math.floor((Math.random() * limit) + 1);
  }
};

function setState(light, state){
  //var state = { bri: 254, sat: 120, hue: 50000 };
  //var state = { bri: 254 };
  return light.setState(state).then(console.log).catch(console.error);
  //return hue.light(name).setState({effect: "colorloop"});
  //return hue.light(name).setState({alert: "lselect"});
};

function disco(light){
  let bri = random(254);

  let job = new CronJob('* * * * * *', function() {
    console.log('You will see this message every second');
    setState(light, { bri: bri() });
  }, null, true, 'America/Los_Angeles');
};

function switchLigth(name){
  let light = hue.light(name);
  return light.getInfo()
    .then(function(info){
      console.log(info);
      if(info.state.on){
        light.off().then(console.log).catch(console.error);
      } else {
        light.on()
        .then(console.log)
        .then(function(){
          return setState(light);
        })
        .catch(console.error);
      }
    });
};

var configFile = path.resolve(__dirname, 'philips-hue.json');

hue
  .login(configFile)
  .then(function(conf){
    let light = hue.light(2);
    disco(light);

    /*return light.getInfo()
      .then(function(info){
        console.log(info);
      })
      .then(function(){
        return setState(light);
      });*/
    //return switchLigth('2');
  })
  .then(function(res){
    console.log(res);
  })
  .catch(function(err){
    console.error(err.stack || err);
  });
