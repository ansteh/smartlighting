'use strict';

const got = require('got');
const path = require('path');
const _ = require('lodash');
const loadJsonFile = require('load-json-file');

let credentials = undefined;

function getCredentials(){
  return new Promise(function(resolve, reject){
    if(credentials){
      resolve(credentials);
    } else {
      return loadJsonFile(path.resolve(__dirname, 'credentials.json'))
      .then(function(json){
        credentials = json;
        resolve(credentials);
      })
      .catch(function(err){
        reject(err);
      });
    }
  });
};

function buildUrl(key, date){
  if(_.isUndefined(date)) date = Date.now();
  return `https://script.google.com/macros/s/${key}/exec?task=meetings&date=${date.valueOf()}`;
};

function request(date){
  return getCredentials().then(function(credentials){
    let requestUrl = buildUrl(credentials.key, date);
    return got(requestUrl, { json: true })
    .then(response => response.body);
  });
};

module.exports = {
  get: request
};
