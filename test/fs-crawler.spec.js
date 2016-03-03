'use strict';

var path    = require('path');

require('chai').should();

var Crawler  = require('../lib/fs-crawler');
var testPath = path.normalize(__dirname + path.sep + 'fs');
var options  = {
  reverse: true,
  noStats: false,
  filters: ['txt'],
  maxDepth: 4
};


var crawler = new Crawler();

var results = crawler.crawlTreeSync(testPath, options);
crawler.setEncoding('utf8');

crawler.on('data', function (data) {
  data = JSON.parse(data);

  console.log(data.folderId, '=>', data.path);
});

crawler.on('end', function (data) {
  console.log(data);
});

crawler.on('close', function (data) {
  console.log('  -- STEAM CLOSED --');
});

crawler.resume();
