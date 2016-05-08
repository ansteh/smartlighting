'use strict';
const path    = require('path');
const _       = require('lodash');
const low     = require('lowdb');
const storage = require('lowdb/file-sync');
const db      = low(path.resolve(__dirname, './calendar.json'), { storage });
