'use strict';
const path  = require('path');
var CronJob = require('cron').CronJob;
const _     = require('lodash');


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
  console.log(index);
  return hue.light(index).catch(console.log);
};

function getLightInfo(light){
  return light.getInfo();
};

function setState(light, state){
  return light.setState(state)
    .then(console.log)
    .catch(console.error);
};

function setBri(index, bri){
  let light = getLight(index);
  return setState(light, { bri: parseFloat(bri, 10)});
};

const parseState = _.curry(function (name, response){
  let originState = _.get(response, '0.success');
  let state = {};
  if(originState){
    let keys = _.keys(originState);
    state[name] = originState[keys[0]];
  }
  return state;
});

const parseSwitchState = parseState('on');

function switchLight(index){
  let light = hue.light(index);
  return light.getInfo()
    .then(function(info){
      //console.log(info);
      if(info.state.on){
        return light.off().then(parseSwitchState);
      } else {
        return light.on().then(parseSwitchState);
      }
    });
};

function getBridges(){
  return hue.getBridges();
};

function getLight(name){
  return hue.light(name)
};

module.exports = {
  login: login,
  getLights: getLights,
  getLightByIndex: getLightByIndex,
  getLightInfo: getLightInfo,
  setState: setState,
  switchLight: switchLight,
  getBridges: getBridges,
  setBri: setBri,
  getLight: getLight
};
