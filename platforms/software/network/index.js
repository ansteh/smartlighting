'use strict';

const _      = require('lodash');
const moment = require('moment');
const pact   = require('brain-pact');

const mock   = require('../mock-data');
const config = require('../config.js');

let transition = pact.employ(config.transition);
let fake = mock(config.mockdata);

function parseDate(date, schema){
  let instance = moment(date);
  let details = {};
  _.forEach(schema, function(entity){
    details[entity] = instance.get(entity);
  });
  return details;
};

function mockDataSet(count){
  let data = fake.produce(count);
  return _.map(data, function(point){
    point.date = new Date(point.date);
    let prepared = transition.prepare(point);
    let input = _.values(_.pick(prepared, config.transition.date.pattern));
    input.push(prepared.meetings);

    return {
      input: input,
      output: [prepared.bri]
    };
  });
};

var synaptic = require('synaptic');
var Neuron = synaptic.Neuron,
	Layer = synaptic.Layer,
	Network = synaptic.Network,
	Trainer = synaptic.Trainer,
	Architect = synaptic.Architect;

function error(before, after){
  return Math.abs(after/before-1);
};

function createSets(count){
  let mockedDataSet = mockDataSet(count);
  let limit = count*0.9;
  let trainingsSet = _.slice(mockedDataSet, 0, limit);
  let testSet = _.slice(mockedDataSet, limit);

  return {
    train: trainingsSet,
    test: testSet
  }
};

function trainBy(set){
  let network = config.network();
  let trainer = new Trainer(network);
  trainer.train(set, config.trainer);
  return network;
};

function logResult(network, testSet){
  _.forEach(testSet, function(point){
    let output = network.activate(point.input);
    let simulated = transition.reverse({ bri: point.output[0] }).bri;
    let forcast = transition.reverse({ bri: output[0] }).bri;

    console.log(error(simulated, forcast), simulated, forcast);
  });
};

function prepare(point){
  let prepared = transition.prepare(point);
  let input = _.values(_.pick(prepared, config.transition.date.pattern));
  input.push(prepared.meetings);
  return input;
};

function reverse(result){
  return transition.reverse({ bri: result[0] });
};

const minuteSteps = 10;
function createDayMarks(){
  let current = moment().hours(0).minutes(0).seconds(0).milliseconds(0);
  let tomorrow = moment().hours(0).minutes(0).seconds(0).milliseconds(0).add(1, 'days');
  let dates = [];
  while(current.isBefore(tomorrow)){
    dates.push(current.toDate().valueOf());
    current.add(minuteSteps, 'minutes');
  }
  return dates;
};

module.exports = {
  trainWithLog: function(){
    let sets = createSets(config.count);
    let network = trainBy(sets.train);
    logResult(network, sets.test);
    return network;
  },
  train: function(cb){
    let sets = createSets(config.count);
    return trainBy(sets.train);
  },
  import: function(json){
    return Network.fromJSON(json);
  },
  forecast: function(network, meetings, date){
    if(_.isUndefined(date)) date = Date.now();
    let input = prepare({ meetings: meetings, date: date });
    return reverse(network.activate(input));
  },
  getDayForecast: function(network, meetings){
    return _.map(createDayMarks(), function(value){
      let input = prepare({ meetings: meetings, date: new Date(value) });
      return {
        date: value,
        bri: reverse(network.activate(input)).bri
      };
    });
  },
  trainByInput: function(data, network){
    let prepared = transition.prepare(data);
    let input = _.values(_.pick(prepared, config.transition.date.pattern));
    input.push(prepared.meetings);

    let set = [{
      input: input,
      output: [prepared.bri]
    }];

    let trainer = new Trainer(network);
    trainer.train(set, config.trainer);
    console.log(set);
  }
};
