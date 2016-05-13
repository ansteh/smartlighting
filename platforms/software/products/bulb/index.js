'use strict';

const Storage  = require('./storage');
const Network  = require('../../network');
const _        = require('lodash');

const Calendar = require('../../storage').Calendar;

console.log(Calendar);

Calendar.save({
  date: Date.now(),
  meetings: 8
});

/*Calendar.request()
.then(console.log);*/

var Bulb = function(product){
  if(Storage.has(product.name) === false){
    Storage.save(product);
  }
  this.instance = Storage.findByName(product.name);

  if(this.instance.network){
    this.instance.network = Network.import(this.instance.network);
  }
};

Bulb.prototype.saveNetwork = function(network){
  this.instance.network = network;
  Storage.insertNetwork(this.instance.name, network.toJSON());
};

Bulb.prototype.forecast = function(date){
  let meetings = 6;
  return Network.forecast(this.instance.network, meetings, date);
};

Bulb.prototype.getDayForecast = function(){
  let meetings = 6;
  return Network.getDayForecast(this.instance.network, meetings);
  //return Network.forecast(this.instance.network, meetings, date);
};

module.exports = Bulb;
