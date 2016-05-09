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
    }],
    network: 'json'
 }
*/

const Bulbs = {
  table: 'bulbs'
};

Bulbs.all = function(){
  return db(Bulbs.table).value();
};

Bulbs.findByName = function(name){
  return _.find(Bulbs.all(), { name: name });
};

Bulbs.has = function(name){
  return _.isUndefined(Bulbs.findByName(name)) === false;
};

Bulbs.insertNetwork = function(name, json){
  return db(Bulbs.table)
    .chain()
    .find({ name: name })
    .assign({ network: json})
    .value();
};

Bulbs.save = function(bulb){
  if(_.isUndefined(bulb)) return;
  if(Bulbs.has(bulb.name) === false){
    db(Bulbs.table).push(bulb);
  }
};

module.exports = Bulbs;
