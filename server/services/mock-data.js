'use strict';
const realtime = require('mock-realtime');
const Day      = realtime.Day;
const _        = require('lodash');
const moment   = require('moment');
const Random   = require('random-js');
const path     = require('path');

const writeJsonFile = require('write-json-file');

const range = function(min, max){
  let engine = Random.engines.mt19937().autoSeed();
  let distribution = Random.integer(min, max);
  return function() {
    return distribution(engine);
  };
};

function simulator(options){
  let now = Day(options.day, Date.now());
  let hours = options.hours;

  _.forOwn(hours, function(options, hour){
    options.bri = range(options.bri[0], options.bri[1]);
    options.meetings = range(options.meetings[0], options.meetings[1]);
  });

  let dates = [1,2,3,4,5];

  function next(){
    let current = now.next();

    if(_.includes(dates, current.day())){
      return {
        date: current.toDate(),
        meetings: hours[current.hours()]['meetings'](),
        bri: hours[current.hours()]['bri']()
      };
    } else {
      return next();
    }
  }
  return next;
};

const create = _.curry((generator, count) => {
  let dates = [];
  for(var i=0; i<count; i+=1){
    let data = generator();
    dates.push({
      date: data.date.valueOf(),
      meetings: data.meetings,
      bri: data.bri
    });
  }
  return dates;
});

const createAndWriteBy = _.curry((generator, count) => {
  return writeJsonFile(path.resolve(__dirname, 'punch.json'), create(generator, count))
  .then(() => {
  	console.log('done');
  });
});

const factory = (options) => {
  let generator = simulator(options);
  return {
    produce: create(generator),
    produceAndWriteBy: createAndWriteBy(generator),
  };
};

module.exports = factory;
