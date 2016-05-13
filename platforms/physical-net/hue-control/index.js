'use strict';
const path = require('path');
var CronJob = require('cron').CronJob;



var Hue = require('philips-hue');
var hue = new Hue();
var configFile = path.resolve(__dirname, 'philips-hue.json');

function login(){
  return hue.login(configFile);
};

function getLights(){
  return getBridges()
  .then(function(bridges){
    if(bridges.length === 0) {
      return {};
    }
    return hue.getLights();
  });
};

function getLightByIndex(index){
  return hue.light(index);
};

function getLightInfo(light){
  return light.getInfo();
};

function setState(light, state){
  return light.setState(state)
    .then(console.log)
    .catch(console.error);
};

function switchLight(index){
  let light = hue.light(index);
  return light.getInfo()
    .then(function(info){
      //console.log(info);
      if(info.state.on){
        return light.off()
        .then(console.log);
      } else {
        return light.on()
        .then(console.log);
      }
    });
};

function getBridges(){
  return hue.getBridges();
};

module.exports = {
  login: login,
  getLights: getLights,
  getLightByIndex: getLightByIndex,
  getLightInfo: getLightInfo,
  setState: setState,
  switchLight: switchLight,
  getBridges: getBridges
};
