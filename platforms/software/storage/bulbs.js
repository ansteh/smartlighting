'use strict';
const path    = require('path');
const _       = require('lodash');
const low     = require('lowdb');
const storage = require('lowdb/file-sync');
const db      = low(path.resolve(__dirname, './bulbs.json'), { storage });

/*
  {
    name: '',
    series: [{
      bri: 123,
      date: 'valueOf'
    }]
 }
*/

/*exports.all = function(){
  return db('jobs').value();
};

exports.findByQuery = function(query){
  let result = _.find(exports.all(), { query: query });
  return result;
};

exports.has = function(query){
  return _.isUndefined(exports.findByQuery(query)) === false;
};

exports.save = function(result){
  if(_.isUndefined(result)) return;
  //console.log('has query', exports.has(result.query));
  if(exports.has(result.query) === false){

    db('jobs').push(result);
  }
};

exports.queries = function(){
  return _.map(exports.all(), function(jobs){
    return jobs.query;
  });
};*/
