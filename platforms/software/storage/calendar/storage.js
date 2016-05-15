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
  return {
    date: Calendar.code(new Date(day.date.valueOf())),
    meetings: day.meetings
  };
};

Calendar.deserialize = function(day){
  return {
    date: Calendar.decode(day.date),
    meetings: day.meetings
  };
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
  if(Calendar.has(day)){
    Calendar.update(day);
  } else {
    db(Calendar.table).push(Calendar.serialize(day));
  }
};

Calendar.update = function(day){
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

  let filteredDays = _.filter(days, function(day){
    let date = Calendar.decode(day.date);
    return start.isSameOrBefore(moment(date))
  });

  return _.map(filteredDays, Calendar.deserialize);
};

Calendar.saveAll = function(days){
  days.forEach(function(day){
    Calendar.save(day);
  });
};

module.exports = Calendar;
