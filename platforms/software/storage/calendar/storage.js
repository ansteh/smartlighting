'use strict';
const path    = require('path');
const _       = require('lodash');
const moment  = require('moment');
const low     = require('lowdb');
const storage = require('lowdb/file-sync');
const db      = low(path.resolve(__dirname, './calendar.json'), { storage });

/*
  {
    date: 'time', //day date
    meetings: 'int'
 }
*/

const Calendar = {
  table: 'calendar',
  stamp: 'MM-DD-YYYY'
};

Calendar.code = function(date){
  return moment(date).format(Calendar.stamp);
};

Calendar.decode = function(string){
  return moment(string, Calendar.stamp).toDate();
};

Calendar.serialize = function(day){
  day.date = Calendar.code(day.date);
  return day;
};

Calendar.deserialize = function(day){
  day.date = Calendar.decode(day.date);
  return day;
};

Calendar.all = function(){
  return db(Calendar.table)
    .chain()
    .map(Calendar.deserialize)
    .value();
};

Calendar.findByDate = function(date){
  return _.find(Calendar.all(), { date: Calendar.code(date) });
};

Calendar.has = function(date){
  return _.isUndefined(Calendar.findByDate(date)) === false;
};

/*Calendar.insertNetwork = function(name, json){
  return db(Calendar.table)
    .chain()
    .find({ name: name })
    .assign({ network: json})
    .value();
};*/

Calendar.save = function(day){
  if(_.isUndefined(day)) return;
  if(Calendar.has(day.date) === false){
    db(Calendar.table).push(Calendar.serialize(day));
  }
};

module.exports = Calendar;
