'use strict';
const resource = require('../../../services').calendar;
const storage  = require('./storage');
const _        = require('lodash');
const moment   = require('moment');

function requestAndSaveAll(start){
  return request(start).then(saveAll);
};

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

function saveAll(days){
  storage.saveAll(days);
};

function save(day){
  storage.save(day);
};

function getMeetings(date){
  if(_.isUndefined(date)) date = Date.now();
  return new Promise(function(resolve, reject){
    requestAndSaveAll()
    .then(storage.filter)
    .then(function(days){
      if(days.length === 0){
        reject('today should have been requested from external resource and saved persistently!');
      } else {
        let day = days[0];
        meetings = day.meetings;
        resolve(meetings);
      }
    })
    .catch(function(err){
      reject(err);
    });
  });
};


let lastSyncDate;
let cacheDurationMinutes = 60;
let meetings;

function getTodaysMeetings(){
  return new Promise(function(resolve, reject){
    if(cacheIsValid()){
      //console.log('get cached date!');
      resolve(meetings);
    } else {
      requestAndSaveAll()
      .then(storage.filter)
      .then(function(days){
        if(days.length === 0){
          reject('today should have been requested from external resource and saved persistently!');
        } else {
          let day = days[0];
          lastSyncDate = moment();
          meetings = day.meetings;
          resolve(meetings);
        }
      })
      .catch(function(err){
        reject(err);
      });
    }
  });
};

function cacheIsValid(){
  if(_.isUndefined(lastSyncDate)) return false;
  return moment().subtract(cacheDurationMinutes, 'minutes').isBefore(lastSyncDate);
};

module.exports = {
  request: request,
  save: save,
  days: storage.filter,
  requestAndSaveAll: requestAndSaveAll,
  getMeetings: getMeetings,
  getTodaysMeetings: getTodaysMeetings
};
