'use strict';

const Storage  = require('./storage');
const Network  = require('../../network');
const _        = require('lodash');
const moment   = require('moment');

const Calendar = require('../../storage').Calendar;

/*Calendar.save({
  date: new Date(),
  meetings: 11
});*/

/*Calendar.request()
.then(console.log);*/

//console.log(Calendar.days(moment('01-14-2016', 'MM-DD-YYYY')));

function updateCalendar(){
  let start = moment().startOf('month').toDate();
  return Calendar.requestAndSaveAll(start);
};

//Calendar.getMeetings().then(console.log).catch(console.log);
//Calendar.getTodaysMeetings().then(console.log).catch(console.log);


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
  if(_.isUndefined(date) || moment().date() === moment(date).date()){
    return Calendar.getTodaysMeetings()
    .then((meetings) => {
      return Network.forecast(this.instance.network, meetings, date);
    });
  } else {
    return Calendar.getMeetings(date)
    .then((meetings) => {
      return Network.forecast(this.instance.network, meetings, date);
    });
  }
};

Bulb.prototype.getDayForecast = function(){
  return Calendar.getTodaysMeetings()
  .then((meetings) => {
    return Network.getDayForecast(this.instance.network, meetings);
  });
};

module.exports = Bulb;
