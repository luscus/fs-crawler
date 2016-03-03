'use strict';

var path     = require('path');
var Crawler  = require('../lib/fs-crawler');
var testRoot = path.normalize(__dirname + path.sep + 'fs');
var options  = {
  reverse: true,
  noStats: false,
  filters: ['txt'],
  maxDepth: 4
};


var crawler = new Crawler();

var results = crawler.crawlTreeSync(testRoot, options);

results.forEach(function (data) {
  console.log('TREE SYNC: ', data.folderId, '=>', data.path);
});

results = crawler.crawlPathSync(__dirname + '/fs/long/deep/path/to/files', options);

console.log('-------------------');

results.forEach(function (data) {
  console.log('PATH SYNC: ', data.folderId, '=>', data.path);
});

process.on('uncaughtException', function (er) {
  console.error('EXCEPTION', er.stack);
});

