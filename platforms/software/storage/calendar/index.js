'use strict';
const path    = require('path');
const _       = require('lodash');
const low     = require('lowdb');
const storage = require('lowdb/file-sync');
const db      = low(path.resolve(__dirname, './calendar.json'), { storage });

const calendar = require('../../../services').calendar;

function request(date){
  return calendar.get(date);
}

module.exports = {
  request: request
};
