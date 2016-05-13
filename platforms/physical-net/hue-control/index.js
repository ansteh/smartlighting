'use strict';
const path = require('path');
var CronJob = require('cron').CronJob;



var Hue = require('philips-hue');
var hue = new Hue();
var configFile = path.resolve(__dirname, 'philips-hue.json');

function login(){
  return hue
    .login(configFile)
    .then(function(conf){
      //let light = hue.light(2);
    })
    .catch(function(err){
      console.error(err.stack || err);
    });
};

function getLights(){
  return hue.getLights();
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

module.exports = {
  login: login,
  getLights: getLights,
  getLightByIndex: getLightByIndex,
  getLightInfo: getLightInfo,
  setState: setState
};
