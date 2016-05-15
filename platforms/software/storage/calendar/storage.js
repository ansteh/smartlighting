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
  let days = db(Calendar.table)
    .chain()
    .value();

  return _.map(days, Calendar.deserialize);
};

Calendar.findByDate = function(date){
  return _.find(db(Calendar.table).value(), { date: Calendar.code(date) });
};

Calendar.has = function(day){
  return _.isUndefined(Calendar.findByDate(day.date)) === false;
};

Calendar.save = function(day){
  if(_.isUndefined(day)) return;

  if(Calendar.has(day) === false){
    console.log('save not found:', day);
    db(Calendar.table).push(Calendar.serialize(day));
  } else {
    Calendar.update(day);
  }
};

Calendar.update = function(day){
  console.log('update', day);

  return db(Calendar.table)
    .chain()
    .find({ date: Calendar.code(day.date) })
    .assign({ meetings: day.meetings })
    .value();
};

Calendar.filter = function(start){
  if(_.isUndefined(start)) start = Date.now();
  start = moment(Calendar.decode(Calendar.code(start)));

  let days = db(Calendar.table)
    .chain()
    .value();

  days = _.filter(days, function(day){
    let date = Calendar.decode(day.date);
    return start.isSameOrBefore(moment(date))
  });

  return _.map(days, Calendar.deserialize);
};

Calendar.saveAll = function(days){
  days.forEach(function(day){
    Calendar.save(day);
  });
};

module.exports = Calendar;
