'use strict';

const network = require('./network');
const Bulb = require('./products/bulb');

const Bulbs = new Map();

//network.trainWithLog();

const getBulbBy = function(product){
  if(Bulbs.has(product.name) === false){
    Bulbs.set(product.name, new Bulb(product));
  }
  return Bulbs.get(product.name);
};

const train = function(product){
  let bulb = getBulbBy(product);
  let net = network.train();
  bulb.saveNetwork(net);

  return net;
};

const forecast = function(product){
  let bulb = getBulbBy(product);
  return bulb.forecast();
};

const getDayForecastOf = function(product){
  let bulb = getBulbBy(product);
  return bulb.getDayForecast();
};

module.exports = {
  train: train,
  forecast: forecast,
  getDayForecastOf: getDayForecastOf
};
