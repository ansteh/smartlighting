'use strict';

const network = require('./network');
const storage = require('./storage');
//network.trainWithLog();

const train = function(product){
  storage.Bulbs.save(product);
  let net = network.train();
  storage.Bulbs.insertNetwork(product.name, net.toJSON());

  return net;
};

const forecast = function(product){
  let bulb = storage.Bulbs.findByName(product.name);
};

module.exports = {
  train: train,
  forecast: forecast
};
