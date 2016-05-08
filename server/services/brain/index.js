'use strict';
const mock = require('../mock-data.js');
const _    = require('lodash');
const pact = require('brain-pact');
const brain = require('brain');

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

const getTrainingPoints = (count) => {
  return _.map(fake.produce(count), (point) => {
    point.date = new Date(point.date);
    return brainify(transition.prepare(point));
  });
};

let inputProperties = _.concat(inputOptions.date.pattern, ['meetings']);
//let inputProperties = ['day', 'hour', 'meetings'];

const brainify = (prepared) => {
  return {
    input: _.pick(prepared, inputProperties),
    output: _.pick(prepared, ['bri'])
  };
};

const trainNet = (count) => {
  let net = new brain.NeuralNetwork({
    hiddenLayers: [5, 4, 3, 2, 1]
  });
  let data = getTrainingPoints(count);
  let info = net.train(data, {
    errorThresh: 0.0015,
    iterations: 20000,
    log: true,
    logPeriod: 10,
    learningRate: 0.9
  });
  console.log(info);

  let test = getTrainingPoints(1)[0];
  let output = net.run(test);
  console.log(test, output, transition.reverse({ bri: test.output.bri }), transition.reverse({ bri: output.bri }));
  //return net;
};

let net = trainNet(10000);
