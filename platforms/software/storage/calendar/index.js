'use strict';
const resource = require('../../../services').calendar;
const storage  = require('./storage');

function request(date){
  return calendar.get(date);
};

function save(day){
  storage.save(day);
};

module.exports = {
  request: request,
  save: save
};