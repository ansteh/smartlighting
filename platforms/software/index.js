'use strict';

const _      = require('lodash');
const moment = require('moment');
const pact   = require('brain-pact');

const mock   = require('./mock-data');
const config = require('./config.js');

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

function test(count){
  let mockedDataSet = mockDataSet(count);
  let limit = count*0.9;
  let trainingsSet = _.slice(mockedDataSet, 0, limit);
  let testSet = _.slice(mockedDataSet, limit);


  var network = config.network();
  var trainer = new Trainer(network);

  trainer.train(trainingsSet, config.trainer);

  _.forEach(testSet, function(point){
    let output = network.activate(point.input);
    let simulated = transition.reverse({ bri: point.output[0] }).bri;
    let forcast = transition.reverse({ bri: output[0] }).bri;

    //console.log(point, simulated, forcast);
    console.log(error(simulated, forcast), simulated, forcast);
  });
};

test(1000);
