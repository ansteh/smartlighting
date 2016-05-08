'use strict';
const mock   = require('./services/mock-data.js');
const _      = require('lodash');
const moment = require('moment');
const pact = require('brain-pact');

let inputOptions = {
  date: {
    type: 'date',
    pattern: ['month', 'week', 'day', 'hour']
  },
  bri: {
    weight: 254
  },
  meetings: {
    weight: 10
  }
};
let transition = pact.employ(inputOptions);

let options = {
  /*dates: {
    1: { hours: hours },
    2: { hours: hours },
    3: { hours: hours },
    4: { hours: hours },
    5: { hours: hours }
  },*/
  hours: {
    17: { bri: [120, 140], meetings: [0, 2]},
    18: { bri: [140, 170], meetings: [2, 4]},
    19: { bri: [170, 220], meetings: [4, 6]},
    20: { bri: [210, 245], meetings: [6, 8]},
    21: { bri: [230, 250], meetings: [7, 9]},
    22: { bri: [245, 254], meetings: [9, 10]}
  },
  day: {
    hours: { min: 17, max: 22 },
    minutes: { min: 0, max: 59 },
    seconds: { min: 0, max: 59 },
    milliseconds: { min: 0, max: 999 }
  }
};

let fake = mock(options);

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
    let input = _.values(_.pick(prepared, inputOptions.date.pattern));
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

function test(count){
  let mockedDataSet = mockDataSet(count);
  let limit = count*0.9;
  let trainingsSet = _.slice(mockedDataSet, 0, limit);
  let testSet = _.slice(mockedDataSet, limit);

  var network = new Architect.Perceptron(5, 3, 1);

  var trainer = new Trainer(network);

  var finished = function(result){
    console.log(result);
  }

  trainer.train(trainingsSet, {
      rate: 0.1,
      iterations: 20000,
      error: 0.001,
      shuffle: true,
      log: 1000,
      cost: Trainer.cost.CROSS_ENTROPY
  });

  _.forEach(testSet, function(point){
    let output = network.activate(point.input);
    console.log(point, transition.reverse({ bri: point.output[0] }), transition.reverse({ bri: output[0] }));
  });
};

test(1000);

/*function Perceptron(input, hidden, output)
{
	// create the layers
	var inputLayer = new Layer(input);
	var hiddenLayer = new Layer(hidden);
	var outputLayer = new Layer(output);

	// connect the layers
	inputLayer.project(hiddenLayer);
	hiddenLayer.project(outputLayer);

	// set the layers
	this.set({
		input: inputLayer,
		hidden: [hiddenLayer],
		output: outputLayer
	});
}

// extend the prototype chain
Perceptron.prototype = new Network();
Perceptron.prototype.constructor = Perceptron;

var myPerceptron = new Perceptron(2,3,1);
var myTrainer = new Trainer(myPerceptron);

console.log(myTrainer.XOR()); // { error: 0.004998819355993572, iterations: 21871, time: 356 }

console.log(myPerceptron.activate([0,0])); // 0.0268581547421616
console.log(myPerceptron.activate([1,0])); // 0.9829673642853368
console.log(myPerceptron.activate([0,1])); // 0.9831714267395621
console.log(myPerceptron.activate([1,1])); // 0.02128894618097928*/
