'use strict';

const transition = {
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

const mockdata = {
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

const synaptic  = require('synaptic');
const Trainer   = synaptic.Trainer;
const Architect = synaptic.Architect;
//console.log(Trainer.cost);

const trainerOptions = {
    rate: 0.3,
    iterations: 10000,
    error: 0.01,
    //shuffle: true,
    log: 1000,
    cost: Trainer.cost.CROSS_ENTROPY
};

module.exports = {
  count: 1000,
  trainer: trainerOptions,
  transition: transition,
  mockdata: mockdata,
  network: function(){
    let network = new Architect.Perceptron(5, 6, 3, 1);
    //let network = new Architect.LSTM(2,4,4,4,1);
    return network;
  }
};
