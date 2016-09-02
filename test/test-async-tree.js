'use strict';

var path     = require('path');
var Crawler  = require('../lib/fs-crawler');
var testRoot = path.normalize(__dirname + path.sep + 'fs');
var options  = {
  flushOnEnd: true,
  reverse:    false,
  noStats:    false,
  maxDepth:   0
};


var crawler = new Crawler();
crawler.crawlTree(testRoot, options);

crawler.setEncoding('utf8');

crawler.on('data', function (data) {
  data = JSON.parse(data);

  console.log('STREAM-DATA-LEAF:', data.folderId, '=> is folder:', (data.is.directory ? 1 : 0), '=>', data.path.replace(testRoot, ''));
});

crawler.on('readable', function () {
  console.log('STREAM-READABLE');
});

crawler.on('end', function (data) {
  console.log('STREAM-END => duration');//, data.duration, 'ms, datasets', data.data.length);
});

crawler.on('error', function (error) {
  console.log('STREAM-ERROR', error);
});

crawler.on('close', function () {
  console.log('  -- STEAM CLOSED --');
});
