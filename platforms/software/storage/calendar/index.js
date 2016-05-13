'use strict';
const resource = require('../../../services').calendar;
const storage  = require('./storage');
const _        = require('lodash');
const moment   = require('moment');

function request(date){
  return resource.get(date).then(parse);
};

function parse(response){
  let start = new Date(response.start);
  start = moment(storage.decode(storage.code(start)));
  return _.map(response.series, function(meetings){
    let date = new Date(start.toDate().toString());
    start.add(1, 'days');
    return {
      date: date,
      meetings: meetings
    };
  });
};

function requestAndSaveAll(start){
  return request(start).then(saveAll);
};

function saveAll(days){
  storage.saveAll(days);
};

function save(day){
  storage.save(day);
};

module.exports = {
  request: request,
  save: save,
  days: storage.filter,
  requestAndSaveAll: requestAndSaveAll
};
